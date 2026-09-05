import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ChatProvider } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import ParticleBackground from '../components/ParticleBackground';
import AuroraBackground from '../components/AuroraBackground';
import CursorGlow from '../components/CursorGlow';
import FloatingSparkles from '../components/FloatingSparkles';
import ThemeToggle from '../components/ThemeToggle';
import MagneticButton from '../components/MagneticButton';
import {
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Bot,
} from 'lucide-react';
import toast from 'react-hot-toast';

function ChatContent() {
  const { logout } = useAuth();
  const { activeConversation } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarDesktop, setSidebarDesktop] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    toast.success('Logged out successfully');
  }, [logout]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setSidebarDesktop((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* VFX layers */}
      <AuroraBackground />
      <CursorGlow />
      <FloatingSparkles count={14} />
      <ParticleBackground density="low" />

      {/* Decorative Pattern */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Desktop Sidebar */}
      <AnimatePresence>
        {sidebarDesktop && (
          <motion.div
            className="hidden md:flex z-10"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar toggle */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            className="md:hidden fixed bottom-6 left-6 z-30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <MagneticButton strength={0.3}>
              <motion.button
                onClick={toggleSidebar}
                className="w-14 h-14 rounded-2xl shadow-premium text-white flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                whileHover={{ scale: 1.08, boxShadow: '0 12px 40px color-mix(in srgb, var(--accent) 35%, transparent)' }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={closeSidebar} />
            <motion.div
              className="relative w-72 h-full"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <Sidebar />
              <motion.button
                onClick={closeSidebar}
                className="absolute top-5 -right-11 w-9 h-9 rounded-r-xl bg-white/80 backdrop-blur-md border border-l-0 border-[rgba(124,58,237,0.15)] flex items-center justify-center text-[#8B7BA8] hover:text-[#7C3AED] shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <header className="glass mx-3 lg:mx-4 mt-3 lg:mt-4 rounded-2xl px-4 lg:px-5 py-3 flex items-center justify-between shadow-warm shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Desktop sidebar toggle */}
            <button
              onClick={toggleDesktopSidebar}
              className="hidden md:flex p-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
              title={sidebarDesktop ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarDesktop ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-premium-sm"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {activeConversation
                    ? activeConversation.title?.length > 35
                      ? activeConversation.title.substring(0, 35) + '...'
                      : activeConversation.title
                    : 'Sasi'}
                </h1>
                <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-faint)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-ping-slow" />
                  Powered by Groq AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm transition-all flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-xl"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 min-h-0">
          <ChatMessages />
        </div>

        {/* Input */}
        <MessageInput />
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
