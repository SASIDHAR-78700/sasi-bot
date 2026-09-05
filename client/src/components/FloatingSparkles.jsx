import { useMemo } from 'react';

const GLYPHS = ['✦', '✧', '◈', '❋', '⋆', '✺'];
const COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--accent-gold)'];

export default function FloatingSparkles({ count = 16 }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        duration: 6 + Math.random() * 7,
        delay: -Math.random() * 12,
        color: COLORS[i % COLORS.length],
        glyph: GLYPHS[i % GLYPHS.length],
      })),
    [count]
  );

  return (
    <div className="sparkle-layer" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            color: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
