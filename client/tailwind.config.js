/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          purple: '#7C3AED',
          'purple-light': '#A78BFA',
          'purple-dark': '#6D28D9',
          'purple-soft': '#EDE9FE',
          gold: '#D4A853',
          'gold-light': '#F5C76D',
          'gold-dark': '#B8923E',
          ivory: '#FFF9F0',
          cream: '#FFFDF7',
          blush: '#FFF0F0',
          sage: '#E8F0E8',
          lavender: '#F0EDFF',
          rose: '#F43F5E',
          emerald: '#10B981',
        },
        bloom: {
          50: '#FFFDF7',
          100: '#FFF9F0',
          200: '#FFF3E0',
          300: '#FFE8C8',
          400: '#F5D7A8',
          500: '#E8C888',
          600: '#D4A853',
          700: '#B8923E',
          800: '#8B6F3E',
          900: '#5C482B',
        },
        petal: {
          lightest: '#FFFDFA',
          lighter: '#FFF9F5',
          light: '#FFF5F0',
          soft: '#F5EDF5',
          medium: '#EDE0ED',
          border: '#E0D0E0',
          accent: '#D4A853',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #7C3AED, #D4A853)',
        'gradient-royal-reverse': 'linear-gradient(135deg, #D4A853, #7C3AED)',
        'gradient-purple-gold': 'linear-gradient(135deg, #7C3AED, #A78BFA, #D4A853)',
        'gradient-warm': 'linear-gradient(135deg, #FFF9F0, #FFFDF7)',
        'gradient-card': 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(212,168,83,0.02))',
        'gradient-card-hover': 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(212,168,83,0.04))',
        'gradient-divider': 'linear-gradient(to right, transparent, rgba(124,58,237,0.12), transparent)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(124,58,237,0.06), transparent)',
        'gradient-message-ai': 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,249,240,0.8))',
        'gradient-message-user': 'linear-gradient(135deg, #7C3AED, #A78BFA)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)',
        'gradient-aurora': 'linear-gradient(135deg, #EDE9FE, #FFF0F0, #FFF9F0, #F0EDFF)',
      },
      boxShadow: {
        'royal-sm': '0 2px 8px rgba(124,58,237,0.08)',
        'royal': '0 4px 20px rgba(124,58,237,0.12)',
        'royal-lg': '0 12px 40px rgba(124,58,237,0.15)',
        'gold-sm': '0 2px 8px rgba(212,168,83,0.15)',
        'gold': '0 4px 20px rgba(212,168,83,0.2)',
        'gold-lg': '0 12px 40px rgba(212,168,83,0.25)',
        'warm': '0 4px 24px rgba(124,58,237,0.06)',
        'warm-lg': '0 12px 48px rgba(124,58,237,0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        'inner-glow-subtle': 'inset 0 1px 0 rgba(255,255,255,0.5)',
        'premium-sm': '0 4px 15px rgba(124,58,237,0.2)',
        'premium': '0 8px 30px rgba(124,58,237,0.25)',
      },
      animation: {
        // New unique animations
        'bloom': 'bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bloom-in': 'bloom-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'ripple': 'ripple 0.6s ease-out forwards',
        'ripple-ring': 'ripple-ring 0.8s ease-out forwards',
        'drift': 'drift 6s ease-in-out infinite',
        'drift-slow': 'drift 8s ease-in-out infinite',
        'drift-reverse': 'drift-reverse 7s ease-in-out infinite',
        'morph': 'morph 4s ease-in-out infinite',
        'aurora': 'aurora 8s ease infinite',
        'aurora-slow': 'aurora 12s ease infinite',
        'ornament-float': 'ornament-float 5s ease-in-out infinite',
        'ornament-spin': 'ornament-spin 20s linear infinite',
        'whisper': 'whisper 0.4s ease-out forwards',
        'whisper-in': 'whisper-in 0.5s ease-out forwards',
        'elegant-spin': 'elegant-spin 15s linear infinite',
        'petal-fall': 'petal-fall 4s ease-in infinite',
        'petal-sway': 'petal-sway 3s ease-in-out infinite',
        'shimmer-sweep': 'shimmer-sweep 2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'scale-soft': 'scale-soft 0.3s ease-out forwards',
        'slide-up-soft': 'slide-up-soft 0.5s ease-out forwards',
        'fade-blur': 'fade-blur 0.6s ease-out forwards',
        'stagger-fade': 'stagger-fade 0.5s ease-out forwards',
        'glide-up': 'glide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glide-down': 'glide-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'morph-glow': 'morph-glow 3s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'twinkle-delayed': 'twinkle 2s ease-in-out 1s infinite',
      },
      keyframes: {
        // Bloom - unique expand from center with elastic overshoot
        bloom: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-5deg)' },
          '60%': { transform: 'scale(1.05) rotate(1deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'bloom-in': {
          '0%': { opacity: '0', transform: 'scale(0.5) translateY(20px)' },
          '70%': { transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        // Ripple - expanding ring effect
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'ripple-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(124,58,237,0.3)' },
          '100%': { boxShadow: '0 0 0 20px rgba(124,58,237,0)' },
        },
        // Drift - slow floating
        drift: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-8px) translateX(4px)' },
          '50%': { transform: 'translateY(-4px) translateX(-3px)' },
          '75%': { transform: 'translateY(-10px) translateX(2px)' },
        },
        'drift-reverse': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(6px) translateX(-3px)' },
          '50%': { transform: 'translateY(3px) translateX(5px)' },
          '75%': { transform: 'translateY(8px) translateX(-2px)' },
        },
        // Morph - smooth shape morphing
        morph: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        // Aurora - flowing gradient waves
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Ornament float - for decorative elements
        'ornament-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(2deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'ornament-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Whisper - subtle reveal with blur
        whisper: {
          '0%': { opacity: '0', filter: 'blur(8px)', transform: 'translateY(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        'whisper-in': {
          '0%': { opacity: '0', filter: 'blur(12px)', transform: 'scale(0.95)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
        'elegant-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Petal animations
        'petal-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'petal-sway': {
          '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(15px) rotate(5deg)' },
          '75%': { transform: 'translateX(-15px) rotate(-5deg)' },
        },
        // Shimmer sweep
        'shimmer-sweep': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Pulse ring
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'scale-soft': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up-soft': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-blur': {
          '0%': { opacity: '0', filter: 'blur(6px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        'stagger-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'glide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'morph-glow': {
          '0%, 100%': { 
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            boxShadow: '0 0 30px rgba(124,58,237,0.1)'
          },
          '50%': { 
            borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%',
            boxShadow: '0 0 60px rgba(124,58,237,0.2)'
          },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
