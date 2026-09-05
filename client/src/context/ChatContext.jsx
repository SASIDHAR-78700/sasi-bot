import { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../api/axios';

const ChatContext = createContext(null);

// Mirror the server's title generation so a brand-new conversation gets a
// sensible title immediately after the first message.
const deriveTitle = (content) =>
  content.length > 50 ? content.substring(0, 50) + '...' : content;

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Tracks which conversation the currently displayed messages belong to.
  // Used to avoid applying optimistic updates / AI responses to the wrong
  // conversation when the user switches chats while a message is in flight.
  const messagesConversationRef = useRef(null);

  // Holds the AbortController for the in-flight streaming request so the
  // user can stop generation with the Stop button.
  const abortControllerRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get('/chat/history');
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchConversation = useCallback(async (id) => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get(`/chat/${id}`);
      messagesConversationRef.current = id;
      setActiveConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const stopGenerating = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (content, options = {}) => {
      const { image = false } = options;
      const targetId = activeConversation?._id || null;
      setSending(true);

      // Optimistically add user message (only if still viewing the target chat)
      const userMessage = { role: 'user', content, _id: `local-${Date.now()}` };
      if (targetId === messagesConversationRef.current) {
        setMessages((prev) => [...prev, userMessage]);
      }

      // Image generation path (single request, no streaming)
      if (image) {
        try {
          const { data } = await api.post('/chat/generate-image', {
            conversationId: targetId,
            prompt: content,
          });
          if (targetId === messagesConversationRef.current) {
            if (!targetId) {
              messagesConversationRef.current = data.conversationId;
              setActiveConversation({
                _id: data.conversationId,
                title: deriveTitle(content),
              });
            }
            setMessages((prev) => [...prev, data.message]);
          }
        } catch (error) {
          if (targetId === messagesConversationRef.current) {
            setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
            const errorMsg =
              error.response?.data?.message || 'Failed to generate image';
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: `⚠️ ${errorMsg}`,
                _id: `error-${Date.now()}`,
              },
            ]);
          }
        } finally {
          setSending(false);
          fetchConversations();
        }
        return;
      }

      // Streaming chat path
      const streamMessageId = `stream-${Date.now()}`;
      if (targetId === messagesConversationRef.current) {
        setMessages((prev) => [
          ...prev,
          // Placeholder assistant bubble that gets filled in as chunks arrive
          { role: 'assistant', content: '', _id: streamMessageId },
        ]);
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      let streamedContent = '';

      // Update the streaming bubble in place (only if still viewing the chat)
      const updateStream = (text) => {
        if (targetId === messagesConversationRef.current) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === streamMessageId ? { ...m, content: text } : m
            )
          );
        }
      };

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${api.defaults.baseURL}/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId: targetId,
            message: content,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to send message');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (separated by a blank line)
          let sep;
          while ((sep = buffer.indexOf('\n\n')) !== -1) {
            const event = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);
            const dataLine = event
              .split('\n')
              .find((l) => l.startsWith('data: '));
            if (!dataLine) continue;

            let payload;
            try {
              payload = JSON.parse(dataLine.slice(6));
            } catch {
              continue;
            }

            if (payload.delta) {
              streamedContent += payload.delta;
              updateStream(streamedContent);
            } else if (payload.done) {
              // If a new conversation was created, keep its id + title in sync
              if (!targetId) {
                messagesConversationRef.current = payload.conversationId;
                setActiveConversation({
                  _id: payload.conversationId,
                  title: deriveTitle(content),
                });
              }
            } else if (payload.error) {
              throw new Error(payload.error);
            }
          }
        }

        // Finalize the streamed message with whatever content arrived
        if (targetId === messagesConversationRef.current) {
          updateStream(streamedContent || 'Sorry, I could not generate a response.');
        }
      } catch (error) {
        if (targetId === messagesConversationRef.current) {
          if (controller.signal.aborted) {
            // User pressed Stop: keep any partial content, drop an empty bubble
            setMessages((prev) =>
              prev.filter(
                (m) => m._id !== streamMessageId || m.content.trim() !== ''
              )
            );
          } else {
            // Real error: remove optimistic messages, show an error bubble
            setMessages((prev) =>
              prev.filter(
                (m) => m._id !== userMessage._id && m._id !== streamMessageId
              )
            );
            const errorMsg = error.message || 'Failed to send message';
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: `⚠️ ${errorMsg}`, _id: `error-${Date.now()}` },
            ]);
          }
        }
      } finally {
        abortControllerRef.current = null;
        setSending(false);
        // Refresh conversation list to pick up the new/updated conversation
        fetchConversations();
      }
    },
    [activeConversation, fetchConversations]
  );

  const deleteConversation = useCallback(
    async (id) => {
      try {
        await api.delete(`/chat/${id}`);
        if (activeConversation?._id === id) {
          messagesConversationRef.current = null;
          setActiveConversation(null);
          setMessages([]);
        }
        fetchConversations();
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    },
    [activeConversation, fetchConversations]
  );

  const newChat = useCallback(() => {
    messagesConversationRef.current = null;
    setActiveConversation(null);
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        sending,
        loadingHistory,
        fetchConversations,
        fetchConversation,
        sendMessage,
        stopGenerating,
        deleteConversation,
        newChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
