import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const taglines = [
  "AI that resonates with your world",
  "Where ideas meet intelligence",
  "Your creative companion",
  "Think bigger, with Sasi",
];

const features = [
  { icon: '✦', title: 'Smart Conversations', desc: 'Context-aware AI that understands you' },
  { icon: '✧', title: 'Lightning Fast', desc: 'Powered by Groq for instant responses' },
  { icon: '◈', title: 'Beautiful Design', desc: 'Elegance in every interaction' },
  { icon: '◇', title: 'Always Learning', desc: 'Adapts to your unique style' },
];

export default function SplashScreen({ onComplete }) {
  const navigate = useNavigate();
  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = useCallback(() => {
    onComplete?.();
    navigate('/login');
  }, [onComplete, navigate]);

  const handleSignIn = useCallback(
    (e) => {
      e.preventDefault();
      onComplete?.();
      navigate('/login');
    },
    [onComplete, navigate]
  );

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF9F0 20%, #F5EDF5 50%, #FFF0F0 80%, #FFFDF7 100%)',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* ====== Animated Background Grid ====== */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ====== Floating Gradient Orbs ====== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main center glow */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full animate-morph-glow"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(212,168,83,0.03) 40%, transparent 70%)',
          }}
        />

        {/* Orbiting orbs */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-200px',
            marginLeft: '-200px',
            background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 60%)',
          }}
          animate={{
            x: [0, 200, 0, -200, 0],
            y: [0, -150, 0, 150, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-150px',
            marginLeft: '-150px',
            background: 'radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 60%)',
          }}
          animate={{
            x: [0, -150, 0, 150, 0],
            y: [0, 120, 0, -120, 0],
            scale: [0.9, 1.05, 1, 0.95, 0.9],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#D4A853' : '#7C3AED',
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              opacity: 0.2 + Math.random() * 0.25,
            }}
            animate={{
              y: [0, -20 - Math.random() * 30, 0],
              opacity: [0.15, 0.4, 0.15],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ====== Main Content ====== */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 lg:px-16">
        {/* Left Section - Brand */}
        <motion.div
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.12)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-ping-slow" />
            <span className="text-xs font-medium text-[#7C3AED] tracking-wider">NOW AVAILABLE</span>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="font-display font-bold text-7xl sm:text-8xl lg:text-9xl leading-none tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gradient" style={{ backgroundSize: '200% 200%' }}>
              Sasi
            </span>
          </motion.h1>

          {/* Animated Tagline */}
          <div className="h-12 sm:h-14 mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                className="font-cormorant text-2xl sm:text-3xl lg:text-4xl italic"
                style={{ color: 'rgba(107, 91, 138, 0.7)' }}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {taglines[currentTagline]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg mb-10 max-w-lg"
            style={{ color: 'rgba(107, 91, 138, 0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Experience the next generation of AI conversation — where elegance meets intelligence in every interaction.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="relative group px-10 py-4 text-base font-semibold rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                boxShadow: '0 8px 40px rgba(124,58,237,0.25)',
              }}
              whileHover={{ scale: 1.04, boxShadow: '0 12px 50px rgba(124,58,237,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ['-150%', '250%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
              <span className="relative flex items-center gap-2.5 text-white">
                Get Started Free
                <motion.svg
                  className="w-4 h-4"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </span>
            </motion.button>

            <motion.button
              onClick={handleSignIn}
              className="px-8 py-4 text-base font-medium rounded-full"
              style={{
                background: 'rgba(124,58,237,0.04)',
                border: '1px solid rgba(124,58,237,0.12)',
                color: 'rgba(107, 91, 138, 0.7)',
              }}
              whileHover={{
                scale: 1.04,
                background: 'rgba(124,58,237,0.08)',
                borderColor: 'rgba(124,58,237,0.25)',
                color: '#7C3AED',
              }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            className="flex items-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${['#7C3AED', '#A78BFA', '#D4A853', '#C0733E'][i]}, ${['#A78BFA', '#7C3AED', '#F5C76D', '#D4A853'][i]})`,
                    border: '2px solid #FFFDF7',
                    color: '#FFFDF7',
                  }}
                >
                  {['S', 'A', 'M', 'P'][i]}
                </div>
              ))}
            </div>
            <span className="text-sm" style={{ color: 'rgba(107, 91, 138, 0.4)' }}>
              Trusted by early adopters
            </span>
          </motion.div>
        </motion.div>

        {/* Right Section - Feature Cards */}
        <motion.div
          className="flex-1 flex flex-col items-center lg:items-end mt-12 lg:mt-0 max-w-xl w-full"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md lg:max-w-none">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group rounded-2xl p-6 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(124,58,237,0.06)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.04)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -6,
                  background: 'rgba(255,255,255,0.9)',
                  borderColor: 'rgba(124,58,237,0.15)',
                  boxShadow: '0 20px 60px rgba(124,58,237,0.08)',
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${['rgba(124,58,237,0.1)', 'rgba(167,139,250,0.1)', 'rgba(212,168,83,0.1)', 'rgba(124,58,237,0.1)'][i]}, transparent)`,
                    border: `1px solid ${['rgba(124,58,237,0.1)', 'rgba(167,139,250,0.1)', 'rgba(212,168,83,0.1)', 'rgba(124,58,237,0.1)'][i]}`,
                    color: ['#7C3AED', '#D4A853', '#A78BFA', '#7C3AED'][i],
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-sm font-display font-semibold text-[color:var(--text)]/80 mb-1">{feature.title}</h3>
                <p className="text-xs" style={{ color: 'rgba(107, 91, 138, 0.5)' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom indicator */}
          <motion.div
            className="mt-8 flex items-center gap-3 text-xs"
            style={{ color: 'rgba(107, 91, 138, 0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-ping-slow" />
            Powered by Groq AI
          </motion.div>
        </motion.div>
      </div>

      {/* ====== Bottom Brand Bar ====== */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 lg:px-16 py-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(107, 91, 138, 0.35)' }}>
            <span>&copy; {new Date().getFullYear()} Sasi</span>
            <span className="hidden sm:inline">Built with passion</span>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <motion.span
                key={item}
                className="text-xs cursor-pointer hover:text-[#7C3AED] transition-colors"
                style={{ color: 'rgba(107, 91, 138, 0.35)' }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
