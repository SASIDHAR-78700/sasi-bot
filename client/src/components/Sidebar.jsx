import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ProfilePopup from './ProfilePopup';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Clock,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const {
    conversations,
    activeConversation,
    fetchConversations,
    fetchConversation,
    deleteConversation,
    newChat,
    loadingHistory,
  } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <aside
      className="w-72 lg:w-80 rounded-2xl m-3 lg:m-4 flex flex-col shrink-0 h-[calc(100vh-24px)] lg:h-[calc(100vh-32px)]"
      style={{
        background: 'var(--card)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--card-border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <div className="p-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-premium-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-gradient-purple">Sasi</span>
          </div>
        </div>

        {/* New Chat Button */}
        <motion.button
          onClick={newChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm shadow-premium-sm"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </motion.button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[color:var(--text-faint)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none border transition-all text-[color:var(--text)] placeholder:text-[color:var(--text-faint)]"
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--card-border)',
            }}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-divider" />
          <span className="text-xs font-semibold text-[color:var(--text-faint)] uppercase tracking-widest">
            {searchQuery ? 'Results' : 'Conversations'}
          </span>
          <div className="h-px flex-1 bg-gradient-divider" />
        </div>

        {loadingHistory && conversations.length === 0 ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.04)' }}
            >
              <MessageSquare className="w-6 h-6 text-[color:var(--text-faint)]" />
            </div>
            <p className="text-[color:var(--text-muted)] text-sm font-medium">
              {searchQuery ? 'No matches found' : 'No conversations yet'}
            </p>
            <p className="text-[color:var(--text-faint)] text-xs mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  activeConversation?._id === conv._id
                    ? 'border'
                    : 'border border-transparent hover:bg-[color:var(--hover-bg)]'
                }`}
                style={
                  activeConversation?._id === conv._id
                    ? {
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.03))',
                        borderColor: 'rgba(124,58,237,0.12)',
                      }
                    : {}
                }
                onClick={() => fetchConversation(conv._id)}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                    activeConversation?._id === conv._id
                      ? 'bg-[color:var(--accent)] shadow-premium-sm'
                      : 'bg-[color:var(--text-faint)] group-hover:bg-[color:var(--text-faint)]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-medium text-[color:var(--text)]">
                    {conv.title?.length > 35 ? conv.title.substring(0, 35) + '...' : conv.title || 'New conversation'}
                  </p>
                  <p className="text-xs text-[color:var(--text-faint)] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(conv.updatedAt)}
                  </p>
                </div>
                <motion.button
                  onClick={(e) => handleDelete(e, conv._id)}
                  className="shrink-0 p-1.5 rounded-lg text-[color:var(--text-faint)] hover:text-rose-500 hover:bg-rose-50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  title="Delete conversation"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* User Info & Profile Popup */}
      <div className="p-4 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-3 px-1 py-1.5">
          <motion.button
            onClick={() => setProfileOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-premium-sm shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            whileHover={{ scale: 1.08, boxShadow: '0 8px 25px rgba(124,58,237,0.3)' }}
            whileTap={{ scale: 0.95 }}
            title="View profile"
          >
            {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
          </motion.button>
          <motion.div
            className="min-w-0 flex-1 cursor-pointer"
            onClick={() => setProfileOpen(true)}
            whileHover={{ opacity: 0.7 }}
          >
            <p className="text-sm font-semibold text-[color:var(--text)] truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[color:var(--text-faint)] truncate">{user?.email || ''}</p>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="p-2 rounded-lg text-[color:var(--text-faint)] hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0"
            title="Logout"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Profile Popup */}
      <ProfilePopup isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </aside>
  );
}
