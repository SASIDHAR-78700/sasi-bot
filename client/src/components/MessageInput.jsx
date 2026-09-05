import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import MagneticButton from './MagneticButton';
import { Send, Square, ImagePlus, Sparkles, CornerDownLeft } from 'lucide-react';

export default function MessageInput() {
  const [input, setInput] = useState('');
  const [imageMode, setImageMode] = useState(false);
  const { sendMessage, stopGenerating, sending } = useChat();
  const textareaRef = useRef(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setInput('');
    setImageMode(false);
    sendMessage(trimmed, { image: imageMode });
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = !input.trim() || sending;

  return (
    <motion.div
      className="px-4 pb-4 pt-2 shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className={`relative ${imageMode ? 'conic-border' : ''}`}>
          <div
            className="rounded-2xl flex items-end px-4 py-3 transition-all border"
            style={{
              background: 'var(--input-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: sending
                ? 'color-mix(in srgb, var(--accent) 30%, transparent)'
                : 'var(--card-border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex-1 flex items-end gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mb-2.5 hidden sm:block" style={{ color: 'var(--text-faint)' }} />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={imageMode ? 'Describe the image you want to generate...' : 'Type your message...'}
                disabled={sending}
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed max-h-[180px]"
                style={{ color: 'var(--text)', minHeight: '24px' }}
              />
            </div>

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {sending ? (
                <motion.button
                  type="button"
                  onClick={stopGenerating}
                  className="p-2.5 rounded-xl transition-all text-white"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Stop generating"
                  aria-label="Stop generating"
                >
                  <Square className="w-4 h-4" fill="currentColor" />
                </motion.button>
              ) : (
                <>
                  {/* Image mode toggle */}
                  <motion.button
                    type="button"
                    onClick={() => setImageMode((prev) => !prev)}
                    className="p-2.5 rounded-xl transition-all"
                    style={{
                      background: imageMode
                        ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
                        : 'var(--hover-bg)',
                      color: imageMode ? '#ffffff' : 'var(--text-faint)',
                      border: '1px solid var(--card-border)',
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title={imageMode ? 'Image mode on — click to switch back to chat' : 'Generate an image (DALL·E)'}
                    aria-label="Toggle image generation"
                    aria-pressed={imageMode}
                  >
                    <ImagePlus className="w-4 h-4" />
                  </motion.button>

                  {/* Send / Generate button */}
                  <MagneticButton strength={0.25}>
                    <motion.button
                      type="submit"
                      disabled={isDisabled}
                      className="p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: isDisabled
                          ? 'var(--hover-bg)'
                          : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      }}
                      whileHover={!isDisabled ? { scale: 1.06 } : {}}
                      whileTap={!isDisabled ? { scale: 0.94 } : {}}
                      title={imageMode ? 'Generate image' : 'Send message'}
                    >
                      {imageMode ? (
                        <ImagePlus className={`w-4 h-4 ${isDisabled ? 'text-[color:var(--text-faint)]' : 'text-white'}`} />
                      ) : (
                        <Send className={`w-4 h-4 ${isDisabled ? 'text-[color:var(--text-faint)]' : 'text-white'}`} />
                      )}
                    </motion.button>
                  </MagneticButton>
                </>
              )}
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs" style={{ color: 'var(--text-faint)' }}>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded-md border font-medium shadow-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              <CornerDownLeft className="w-2.5 h-2.5 inline" />
            </kbd>
            <span>{imageMode ? 'to generate image' : 'to send'}</span>
            <span className="text-[color:var(--text-faint)]">·</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded-md border font-medium shadow-sm" style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              Shift + ↵
            </kbd>
            <span>new line</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
