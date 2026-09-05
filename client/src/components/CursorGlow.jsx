import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip on touch devices — no mouse to track
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      el.style.setProperty('--gx', `${e.clientX}px`);
      el.style.setProperty('--gy', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
