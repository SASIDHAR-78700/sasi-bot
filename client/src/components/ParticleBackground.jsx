import { useEffect, useRef } from 'react';

export default function ParticleBackground({ className = '', density = 'normal' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -1000;
    let mouseY = -1000;

    const densityMap = { low: 22000, normal: 15000, high: 10000 };
    const particleDensity = densityMap[density] || 15000;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / particleDensity), 70);
      const colorPalettes = [
        // Soft purple
        { hue: [260, 290], sat: [30, 45], light: [65, 78] },
        // Lavender
        { hue: [250, 270], sat: [25, 40], light: [70, 82] },
        // Warm gold
        { hue: [38, 50], sat: [35, 50], light: [65, 75] },
        // Soft pink
        { hue: [320, 340], sat: [20, 35], light: [75, 85] },
        // Light violet
        { hue: [270, 285], sat: [25, 40], light: [70, 80] },
      ];

      const particles = [];
      for (let i = 0; i < count; i++) {
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        const hue = palette.hue[0] + Math.random() * (palette.hue[1] - palette.hue[0]);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.4,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.18 + 0.03,
          hue,
          saturation: palette.sat[0] + Math.random() * (palette.sat[1] - palette.sat[0]),
          lightness: palette.light[0] + Math.random() * (palette.light[1] - palette.light[0]),
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.012,
          orbit: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.0012,
          orbitRadius: Math.random() * 20 + 6,
        });
      }

      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const maxDist = Math.min(width, height) * 0.18;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbital movement
        p.orbit += p.orbitSpeed;
        p.x += p.speedX + Math.cos(p.orbit) * 0.02;
        p.y += p.speedY + Math.sin(p.orbit) * 0.02;

        // Mouse interaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 140) {
          const force = (140 - distToMouse) / 140;
          p.x += (dx / distToMouse) * force * 1.2;
          p.y += (dy / distToMouse) * force * 1.2;
        }

        // Wrap around
        const padding = 60;
        if (p.x < -padding) p.x = width + padding;
        if (p.x > width + padding) p.x = -padding;
        if (p.y < -padding) p.y = height + padding;
        if (p.y > height + padding) p.y = -padding;

        // Pulse
        p.pulse += p.pulseSpeed;
        const pulseOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${pulseOpacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${pulseOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.035;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 40%, 75%, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();

    const handleResize = () => { resize(); initParticles(); };
    const handleMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const handleMouseLeave = () => { mouseX = -1000; mouseY = -1000; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.45 }}
    />
  );
}
