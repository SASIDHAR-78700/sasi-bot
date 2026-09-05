const Groq = require('groq-sdk');
const OpenAI = require('openai');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// OpenAI client is created lazily so the server still starts without an
// image-generation key configured.
let openaiClient = null;
const getOpenAI = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

// Keep history sent to the model bounded so long chats do not exceed the
// model's context window.
const MAX_HISTORY_MESSAGES = 20;

// Cap message size to prevent abuse and runaway API costs.
const MAX_MESSAGE_LENGTH = 4000;

// Cap image prompt length (image APIs bill per generated image).
const MAX_IMAGE_PROMPT_LENGTH = 1000;

// Stream a completion to the client as Server-Sent Events. The client can
// stop generation by disconnecting, which aborts the upstream Groq request.
const handleStreaming = async (req, res, { conversation, conversationId, messagesForGroq, model }) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  // Swallow EPIPE-style errors if the client disconnects mid-write
  res.on('error', () => {});

  let fullContent = '';
  let finished = false;
  let timedOut = false;

  const controller = new AbortController();
  const onClose = () => {
    if (!finished) controller.abort();
  };
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 60000);

  req.on('close', onClose);

  const send = (payload) => {
    if (res.destroyed || res.writableEnded) return;
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const completion = await groq.chat.completions.create(
      {
        messages: messagesForGroq,
        model,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      },
      { signal: controller.signal }
    );

    for await (const chunk of completion) {
      const delta = chunk.choices?.[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        send({ delta });
      }
    }

    if (!fullContent.trim()) {
      fullContent = 'Sorry, I could not generate a response.';
    }

    conversation.messages.push({ role: 'assistant', content: fullContent });
    await conversation.save();
    finished = true;

    send({ done: true, conversationId: conversation._id });
    res.end();
  } catch (error) {
    finished = true;
    if (controller.signal.aborted) {
      // Client stopped generation (or our 60s guard fired). Keep the user
      // message and any partial AI content so the conversation isn't lost.
      if (fullContent.trim()) {
        conversation.messages.push({ role: 'assistant', content: fullContent });
      }
      await conversation.save().catch(() => {});
      if (timedOut) {
        send({ error: 'The AI took too long to respond. Please try again.' });
      }
      res.end();
    } else {
      console.error('Groq stream error:', error.message);
      // Roll back the user message; remove brand-new empty conversations.
      conversation.messages.pop();
      if (!conversationId) {
        await Conversation.deleteOne({ _id: conversation._id }).catch(() => {});
      } else {
        await conversation.save().catch(() => {});
      }
      send({ error: 'AI service unavailable. Please try again later.' });
      res.end();
    }
  } finally {
    clearTimeout(timer);
    req.off('close', onClose);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message, stream } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      });
    }

    if (conversationId && !mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    let conversation;

    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // Create new conversation
      // Generate title from the first 50 chars of the user's message
      const title =
        message.length > 50 ? message.substring(0, 50) + '...' : message;

      conversation = await Conversation.create({
        userId: req.user._id,
        title,
        messages: [],
      });
    }

    // Add user message to conversation (saved together with the AI reply below)
    conversation.messages.push({ role: 'user', content: message });

    // Build message history for Groq API (bounded to the most recent messages)
    const messagesForGroq = [
      {
        role: 'system',
        content:
          'You are Sasi, a helpful AI assistant. When the user calls you Sasi or addresses you by that name, respond naturally and acknowledge them as Sasi.',
      },
      ...conversation.messages.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Model is configurable via GROQ_MODEL so it can be updated without a redeploy.
    // Default is a current, supported model (llama-3.1-8b-instant was decommissioned 2026-08-16).
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    if (stream) {
      return handleStreaming(req, res, {
        conversation,
        conversationId,
        messagesForGroq,
        model,
      });
    }

    // Non-streaming path (backward compatible)
    try {
      // Call Groq API (abort after 30s so a hung upstream request never
      // leaves the client waiting forever).
      const completion = await groq.chat.completions.create(
        {
          messages: messagesForGroq,
          model,
          temperature: 0.7,
          max_tokens: 1024,
        },
        { signal: AbortSignal.timeout(30000) }
      );

      const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Add AI response to conversation
      conversation.messages.push({ role: 'assistant', content: aiResponse });
      await conversation.save();

      res.json({
        conversationId: conversation._id,
        message: {
          role: 'assistant',
          content: aiResponse,
          _id: conversation.messages[conversation.messages.length - 1]._id,
        },
      });
    } catch (groqError) {
      const isTimeout =
        groqError.name === 'TimeoutError' ||
        groqError.name === 'AbortError' ||
        groqError.code === 'ETIMEDOUT';
      console.error('Groq API error:', groqError.message);

      // If Groq API fails, remove the user message we added
      conversation.messages.pop();
      await conversation.save();

      // If this was a brand-new conversation and the AI never responded,
      // don't leave an empty conversation behind in the user's history.
      if (!conversationId) {
        await Conversation.deleteOne({ _id: conversation._id });
      }

      res.status(isTimeout ? 504 : 502).json({
        message: isTimeout
          ? 'The AI took too long to respond. Please try again.'
          : 'AI service unavailable. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

exports.generateImage = async (req, res) => {
  try {
    const { conversationId, prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (prompt.length > MAX_IMAGE_PROMPT_LENGTH) {
      return res.status(400).json({
        message: `Prompt cannot exceed ${MAX_IMAGE_PROMPT_LENGTH} characters`,
      });
    }

    if (conversationId && !mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(503)
        .json({ message: 'Image generation is not configured. Set OPENAI_API_KEY.' });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      const title =
        prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
      conversation = await Conversation.create({
        userId: req.user._id,
        title,
        messages: [],
      });
    }

    // Add the user's prompt to the conversation
    conversation.messages.push({ role: 'user', content: prompt });

    try {
      // Generate the image (abort after 90s so a hung upstream request never
      // leaves the client waiting forever).
      const result = await getOpenAI().images.generate(
        {
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json',
        },
        { signal: AbortSignal.timeout(90000) }
      );

      const b64 = result.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error('Image API returned no image data');
      }

      // Embed the image as a data URI so it persists in chat history
      const content = `![Generated image](data:image/png;base64,${b64})`;
      conversation.messages.push({ role: 'assistant', content });
      await conversation.save();

      const savedMessage = conversation.messages[conversation.messages.length - 1];
      res.json({
        conversationId: conversation._id,
        message: {
          role: 'assistant',
          content: savedMessage.content,
          _id: savedMessage._id,
        },
      });
    } catch (imgError) {
      console.error('Image generation error:', imgError.message);

      // Roll back the user message; remove brand-new empty conversations.
      conversation.messages.pop();
      if (!conversationId) {
        await Conversation.deleteOne({ _id: conversation._id }).catch(() => {});
      } else {
        await conversation.save().catch(() => {});
      }

      res.status(502).json({
        message: 'Image generation failed. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ message: 'Server error while generating image' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error fetching conversation' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};
