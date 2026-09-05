import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AuroraBackground from '../components/AuroraBackground';
import FloatingSparkles from '../components/FloatingSparkles';
import MagneticButton from '../components/MagneticButton';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const getAuthErrorMessage = (err, fallback) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === 'ERR_NETWORK') return 'Cannot reach the server. Check the deployed API URL and CORS settings.';
  if (err.response?.status === 404) return 'Authentication API not found. Check VITE_API_URL.';
  return fallback;
};

export default function Login() {
  const [tab, setTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const switchTab = useCallback((t) => {
    if (t === tab) return;
    setTab(t);
    setError('');
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        await register(name, email, password);
        toast.success('Account created successfully!');
      } catch (err) {
        const msg = getAuthErrorMessage(err, 'Registration failed');
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      setLoading(true);
      try {
        await login(email, password);
        toast.success('Welcome back to Sasi');
      } catch (err) {
        const msg = getAuthErrorMessage(err, 'Login failed');
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const formVariants = useMemo(() => ({
    enter: { opacity: 0, x: tab === 'signup' ? 30 : -30, filter: 'blur(4px)' },
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: tab === 'signup' ? -30 : 30, filter: 'blur(4px)' },
  }), [tab]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* VFX layers */}
      <AuroraBackground />
      <FloatingSparkles count={12} />

      {/* Ambient Morphing Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute animate-morph-glow" style={{ top: '-120px', left: '5%', width: '450px', height: '450px', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(212,168,83,0.04))' }} />
        <div className="absolute animate-morph-glow" style={{ bottom: '-150px', right: '5%', width: '500px', height: '500px', background: 'linear-gradient(135deg, rgba(212,168,83,0.05), rgba(167,139,250,0.03))', animationDelay: '-3s' }} />
        <div className="absolute animate-drift" style={{ top: '30%', right: '8%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)' }} />
        <div className="absolute animate-drift-reverse" style={{ bottom: '25%', left: '5%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Decorative Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="animate-ornament-float" style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '45px', color: 'rgba(124,58,237,0.05)' }}>✦</div>
        <div className="animate-ornament-float" style={{ position: 'absolute', top: '20%', right: '8%', fontSize: '30px', color: 'rgba(212,168,83,0.05)', animationDelay: '-2s' }}>✧</div>
        <div className="animate-ornament-float" style={{ position: 'absolute', bottom: '35%', left: '10%', fontSize: '35px', color: 'rgba(167,139,250,0.04)', animationDelay: '-4s' }}>✦</div>
      </div>

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-premium"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[color:var(--text)]">
            Welcome to{' '}
            <span className="text-gradient" style={{ backgroundSize: '200% 200%' }}>
              Sasi
            </span>
          </h1>
          <p className="text-[color:var(--text-muted)] mt-1.5 text-sm font-cormorant italic text-lg">AI that resonates with your world</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="rounded-[24px] px-8 py-8 sm:px-10 sm:py-10"
          style={{
            background: 'var(--card-strong)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--card-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tab Toggle */}
          <div className="relative flex rounded-xl p-1 mb-7" style={{ background: 'rgba(124, 58, 237, 0.04)' }}>
            <motion.div
              className="absolute top-1 bottom-1 w-1/2 rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              animate={{ left: tab === 'signin' ? '4px' : 'calc(50% - 4px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => switchTab('signin')}
              className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10"
              style={{ color: tab === 'signin' ? '#ffffff' : '#8B7BA8' }}
            >
              SIGN IN
            </button>
            <button
              onClick={() => switchTab('signup')}
              className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10"
              style={{ color: tab === 'signup' ? '#ffffff' : '#8B7BA8' }}
            >
              SIGN UP
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Name - signup only */}
              {tab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <label className="block text-xs font-semibold text-[color:var(--text-muted)] mb-1.5 tracking-wide uppercase">
                    <User className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-[color:var(--text)] rounded-xl px-4 py-3 outline-none border transition-all duration-200 placeholder:text-[color:var(--text-faint)] focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/10 hover:border-[#7C3AED]/30"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--card-border)',
                    }}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[color:var(--text-muted)] mb-1.5 tracking-wide uppercase">
                  <Mail className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[color:var(--text)] rounded-xl px-4 py-3 outline-none border transition-all duration-200 placeholder:text-[color:var(--text-faint)] focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/10 hover:border-[#7C3AED]/30"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(124, 58, 237, 0.12)',
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[color:var(--text-muted)] mb-1.5 tracking-wide uppercase">
                  <Lock className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-[color:var(--text)] rounded-xl px-4 py-3 pr-11 outline-none border transition-all duration-200 placeholder:text-[color:var(--text-faint)] focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/10 hover:border-[#7C3AED]/30"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--card-border)',
                    }}
                    placeholder={tab === 'signup' ? 'Min 6 characters' : 'Your password'}
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-faint)] hover:text-[color:var(--text-muted)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - signup only */}
              {tab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <label className="block text-xs font-semibold text-[color:var(--text-muted)] mb-1.5 tracking-wide uppercase">
                    <Lock className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-[color:var(--text)] rounded-xl px-4 py-3 outline-none border transition-all duration-200 placeholder:text-[color:var(--text-faint)] focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/10 hover:border-[#7C3AED]/30"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--card-border)',
                    }}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-1">
                <MagneticButton strength={0.25} className="w-full">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3.5 text-white rounded-xl font-semibold text-sm tracking-wide overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)',
                  }}
                  whileHover={{ scale: 1.015, boxShadow: '0 6px 28px color-mix(in srgb, var(--accent) 35%, transparent)' }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </span>
                  {loading ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {tab === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      {tab === 'signup' ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </motion.button>
                </MagneticButton>
              </div>

              {/* Switch tab hint */}
              <p className="text-center text-xs text-[color:var(--text-faint)] pt-1">
                {tab === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchTab('signup')} className="text-[color:var(--accent)] hover:text-[color:var(--accent-2)] font-medium transition-colors">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchTab('signin')} className="text-[color:var(--accent)] hover:text-[color:var(--accent-2)] font-medium transition-colors">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-[color:var(--text-faint)] mt-6 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          &copy; {new Date().getFullYear()} Sasi. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
