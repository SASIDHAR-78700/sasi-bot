import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Wraps a button with a magnetic hover effect — the element leans toward the
 * cursor and springs back when it leaves. `as` lets callers render a <button>
 * or any element; className/style pass through to the inner motion element.
 */
export default function MagneticButton({ children, strength = 0.3, className = '', style, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.5 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, display: 'inline-flex', ...style }}
      className={`inline-flex ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  );
}
