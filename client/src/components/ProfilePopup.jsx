import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Calendar, Shield, LogOut, X, Trash2, AlertTriangle, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCENT_COLORS = {
  royal: ['#7C3AED', '#A78BFA'],
  gold: ['#C9920E', '#F5C76D'],
  emerald: ['#059669', '#34D399'],
  rose: ['#E11D48', '#FB7185'],
};

export default function ProfilePopup({ isOpen, onClose }) {
  const { user, logout, deleteAccount } = useAuth();
  const { accent, setAccent } = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onClose();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50"
            style={{
              bottom: '90px',
              left: '24px',
              width: '300px',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                boxShadow: '0 20px 60px rgba(124,58,237,0.12), 0 8px 20px rgba(0,0,0,0.06)',
              }}
            >
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(167,139,250,0.02))',
                  borderBottom: '1px solid rgba(124,58,237,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-premium-sm"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text)]">{user?.name || 'User'}</p>
                    <p className="text-xs text-[color:var(--text-faint)]">Profile</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[color:var(--text-faint)] hover:text-[color:var(--text)] hover:bg-[color:var(--hover-bg)] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-5 py-3 space-y-0.5">
                <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[color:var(--hover-bg)] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[color:var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[color:var(--text-faint)]">Email</p>
                    <p className="text-sm text-[color:var(--text)] truncate">{user?.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[color:var(--hover-bg)] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-[color:var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[color:var(--text-faint)]">Account Status</p>
                    <p className="text-sm text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[color:var(--hover-bg)] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-[color:var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[color:var(--text-faint)]">Member Since</p>
                    <p className="text-sm text-[color:var(--text)]">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              {/* Accent theme picker */}
              <div
                className="px-5 py-3"
                style={{ borderTop: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center gap-3 px-2 py-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--hover-bg)' }}
                  >
                    <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Theme Accent</p>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>Choose a color style</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 pb-1">
                  {Object.entries(ACCENT_COLORS).map(([name, [c1, c2]]) => (
                    <motion.button
                      key={name}
                      onClick={() => setAccent(name)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${c1}, ${c2})`,
                        boxShadow: accent === name ? '0 0 0 2px var(--card-strong), 0 0 0 4px var(--accent)' : 'none',
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      title={`${name} accent`}
                      aria-label={`Use ${name} accent`}
                      aria-pressed={accent === name}
                    />
                  ))}
                </div>
              </div>
              <div
                className="px-5 py-3"
                style={{ borderTop: '1px solid var(--card-border)' }}
              >
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'rgba(239, 68, 68, 0.04)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                  }}
                  whileHover={{
                    scale: 1.01,
                    background: 'rgba(239, 68, 68, 0.08)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>

                {/* Delete Account */}
                <div
                  className="mt-3 rounded-xl border border-rose-200/60 overflow-hidden"
                  style={{ background: 'rgba(239, 68, 68, 0.02)' }}
                >
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="p-3 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-600 leading-relaxed">
                          This permanently deletes your account and all chats. This cannot be undone.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmDelete(false)}
                          disabled={deleting}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-[color:var(--text-muted)] bg-white border border-[color:var(--card-border)] hover:bg-[color:var(--hover-bg)] transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}
                        >
                          {deleting ? 'Deleting...' : 'Yes, delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
