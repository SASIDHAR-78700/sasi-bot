import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

// React-markdown unwraps <pre> via the `pre` renderer, so the `code` renderer
// needs a way to know it came from a block-level <pre>.
const BlockCodeContext = createContext(false);

function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const language =
    (className || '')
      .split(/\s+/)
      .find((c) => c.startsWith('language-'))
      ?.slice('language-'.length) || 'code';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-3">
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-xl"
        style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(124,58,237,0.12)' }}
      >
        <span className="text-xs text-[#B0A0C0] font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#B0A0C0] hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-[#A78BFA]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="!rounded-t-none !mt-0 !border-t-0 !pt-4" style={{ background: '#1a1a2e' }}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function MarkdownContent({ content }) {
  return (
    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-[color:var(--text)] prose-a:text-[color:var(--accent)] prose-strong:text-[color:var(--text)] prose-code:text-[color:var(--accent)] prose-code:bg-[color:var(--hover-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          img({ src, alt }) {
            return <img src={src} alt={alt || ''} className="gen-image" loading="lazy" />;
          },
          code({ className, children, ...props }) {
            const isBlock = useContext(BlockCodeContext) || /language-/.test(className || '');
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <BlockCodeContext.Provider value={true}>{children}</BlockCodeContext.Provider>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Reveals `fullText` at a steady pace (~14 chars per 33ms ≈ 420 chars/sec)
// so responses look like they are being typed, even when the upstream API
// delivers them in bursts. The display never gets ahead of what has arrived,
// and once it catches up the extra ticks are no-ops.
function useSteadyReveal(fullText, enabled) {
  const [shown, setShown] = useState(enabled ? '' : fullText);
  const fullRef = useRef(fullText);
  fullRef.current = fullText;

  useEffect(() => {
    if (!enabled) {
      setShown(fullText);
      return;
    }
    const id = setInterval(() => {
      setShown((prev) => {
        const target = fullRef.current;
        const next = Math.min(prev.length + 14, target.length);
        return target.slice(0, next);
      });
    }, 33);
    return () => clearInterval(id);
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return enabled ? shown : fullText;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const messageVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 },
  },
};

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex gap-3 max-w-[80%] md:max-w-[70%]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-premium-sm"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
        >
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-warm"
          style={{
            background: 'var(--card-strong)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--card-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[color:var(--accent)] typing-dot" />
              <span className="w-2 h-2 rounded-full bg-[color:var(--accent-2)] typing-dot" />
              <span className="w-2 h-2 rounded-full bg-[color:var(--accent-gold)] typing-dot" />
            </div>
            <span className="text-[color:var(--text-muted)] text-sm font-medium">Thinking...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MessageCard({ message, isUser, isStreaming }) {
  // Streamed messages render through the steady typewriter reveal; everything
  // else (history, errors, user text) renders instantly.
  const isStreamMessage = message._id?.startsWith('stream-');
  const shownContent = useSteadyReveal(message.content, isStreamMessage);

  return (
    <motion.div
      variants={messageVariants}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        className={`flex gap-2.5 max-w-[88%] md:max-w-[78%] ${isUser ? 'flex-row-reverse' : ''}`}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Avatar with streaming pulse rings */}
        <div className="relative shrink-0 mt-4">
          {isStreaming && (
            <>
              <span className="avatar-ring" />
              <span className="avatar-ring avatar-ring-delay" />
            </>
          )}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-premium-sm"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
          >
            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
        </div>

        {/* Card */}
        <div className="min-w-0 flex-1">
          {/* Header bar — role label + badge + timestamp */}
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span
              className="text-xs font-semibold"
              style={{ color: isUser ? 'var(--text-faint)' : 'var(--text-muted)' }}
            >
              {isUser ? 'You' : 'Synthara'}
            </span>
            {!isUser && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--hover-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--card-border)',
                }}
              >
                Groq AI
              </span>
            )}
            {message.createdAt && (
              <span className="text-[10px] ml-auto" style={{ color: 'var(--text-faint)' }}>
                {new Date(message.createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          {/* Body */}
          <motion.div
            className="rounded-2xl px-5 py-3.5 relative group"
            style={
              isUser
                ? {
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    boxShadow: '0 8px 28px color-mix(in srgb, var(--accent) 28%, transparent)',
                  }
                : {
                    background: 'var(--card-strong)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  }
            }
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-white font-medium">
                {shownContent}
              </p>
            ) : message._id?.startsWith('error-') ? (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-600 mb-1">Error</p>
                  <p className="text-sm text-[color:var(--text-muted)]">{message.content.replace('⚠️ ', '')}</p>
                </div>
              </div>
            ) : (
              <MarkdownContent content={shownContent} />
            )}

            {/* Copy button for AI messages */}
            {!isUser && !message._id?.startsWith('error-') && !isStreaming && message.content && (
              <motion.button
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast.success('Copied to clipboard!');
                }}
                className="absolute -top-2.5 -right-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all p-2 rounded-xl border"
                style={{
                  background: 'var(--card-strong)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-faint)',
                }}
                whileHover={{ scale: 1.1, color: 'var(--accent)' }}
                whileTap={{ scale: 0.9 }}
                title="Copy message"
                aria-label="Copy message"
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {message._id?.startsWith('error-') && (
              <div className="absolute -top-2.5 -right-2.5 p-1.5 rounded-full bg-rose-100 border border-rose-200">
                <AlertCircle className="w-3 h-3 text-rose-500" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChatMessages() {
  const { messages, sending } = useChat();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // While streaming, the growing assistant bubble is the indicator itself.
  const showTypingIndicator =
    sending && !messages.some((m) => m._id?.startsWith('stream-') && m.content);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  if (messages.length === 0 && !sending) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-lg"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-premium animate-float-soft"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            animate={{
              boxShadow: [
                '0 8px 30px color-mix(in srgb, var(--accent) 25%, transparent)',
                '0 8px 50px color-mix(in srgb, var(--accent) 40%, transparent)',
                '0 8px 30px color-mix(in srgb, var(--accent) 25%, transparent)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gradient mb-2">Start a conversation</h2>
          <p className="text-[color:var(--text-muted)]">Type a message below to begin chatting with Synthara.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[color:var(--text-faint)] flex-wrap">
            <kbd className="px-2.5 py-1 text-xs rounded-lg border text-[color:var(--text-muted)] font-medium shadow-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
              Enter
            </kbd>
            <span className="text-xs">to send</span>
            <span className="text-[color:var(--text-faint)] mx-1">·</span>
            <kbd className="px-2.5 py-1 text-xs rounded-lg border text-[color:var(--text-muted)] font-medium shadow-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
              Shift + Enter
            </kbd>
            <span className="text-xs">new line</span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-[color:var(--text-faint)] text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-ping-slow" />
            Powered by Groq AI
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-4 py-6 scroll-smooth">
      <motion.div
        className="max-w-3xl mx-auto space-y-5"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {messages.map((msg) => (
          <MessageCard
            key={msg._id}
            message={msg}
            isUser={msg.role === 'user'}
            isStreaming={sending && msg._id?.startsWith('stream-')}
          />
        ))}

        {/* Typing Indicator (only until the first streamed chunk arrives) */}
        <AnimatePresence>{showTypingIndicator && <TypingIndicator />}</AnimatePresence>

        <div ref={messagesEndRef} />
      </motion.div>
    </div>
  );
}
