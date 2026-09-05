import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Chat from './pages/Chat';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF9F0 50%, #F5EDF5 100%)' }}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-royal shadow-premium flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-transparent border-t-purple-400 border-r-[#D4A853] animate-elegant-spin" />
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const [splashComplete, setSplashComplete] = useState(false);
  const [splashSeen, setSplashSeen] = useState(() => {
    return sessionStorage.getItem('synthara_splash_seen') === 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('synthara_splash_seen', 'true');
    setSplashComplete(true);
  };

  useEffect(() => {
    if (user && splashSeen) {
      setSplashComplete(true);
    }
  }, [user, splashSeen]);

  if (loading) {
    return <LoadingScreen />;
  }

  const showSplash = !splashComplete && !splashSeen;
  const showApp = splashComplete || splashSeen;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {showApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <AnimatedRoutes />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
