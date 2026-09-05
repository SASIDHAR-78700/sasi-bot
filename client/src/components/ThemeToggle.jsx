import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${className}`}
      style={{
        background: 'var(--hover-bg)',
        border: '1px solid var(--card-border)',
        color: 'var(--text-muted)',
      }}
      whileHover={{ scale: 1.08, color: 'var(--accent)' }}
      whileTap={{ scale: 0.92 }}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatedIcon dark={dark} />
    </motion.button>
  );
}

function AnimatedIcon({ dark }) {
  return (
    <motion.span
      key={dark ? 'moon' : 'sun'}
      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center justify-center"
    >
      {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </motion.span>
  );
}
