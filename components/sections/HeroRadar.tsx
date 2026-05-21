'use client';

import { useEffect, useRef } from 'react';

const LINES = [
  'no one cares, work harder',
];

type Blip = {
  x: number;
  y: number;
  text: string;
  textLife: number;
  pulse: number;
  born: number;
};

export default function HeroRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 420;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const R = SIZE / 2 - 6;

    const used = new Set<number>();
    function getLine(): string {
      if (used.size >= LINES.length) used.clear();
      const available = LINES.map((_, i) => i).filter(i => !used.has(i));
      const idx = available[Math.floor(Math.random() * available.length)];
      used.add(idx);
      return LINES[idx];
    }

    let blips: Blip[] = [];
    let sweepAngle = -Math.PI / 2;
    let sweepSpeed = 0.011;
    let targetSpeed = 0.011;
    let mouseInside = false;
    let mouseX = -999;
    let mouseY = -999;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - CX;
      const my = e.clientY - rect.top - CY;
      mouseX = mx + CX;
      mouseY = my + CY;
      const d = Math.hypot(mx, my);
      mouseInside = d < R;
      targetSpeed = mouseInside ? 0.026 : 0.011;
    };

    const handleLeave = () => {
      mouseInside = false;
      mouseX = -999;
      mouseY = -999;
      targetSpeed = 0.011;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - CX;
      const my = e.clientY - rect.top - CY;
      const d = Math.hypot(mx, my);
      if (d > R - 4) return;
      blips.push({
        x: mx + CX,
        y: my + CY,
        text: getLine(),
        textLife: 1,
        pulse: 0,
        born: Date.now(),
      });
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('click', handleClick);

    let visible = true;
    function draw() {
      if (!ctx || !visible) return;
      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = 'rgba(5,6,16,0.98)';
      ctx.fillRect(0, 0, SIZE, SIZE);

      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(CX, CY, (R * i) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = i === 4 ? 'rgba(26,86,255,0.22)' : 'rgba(26,86,255,0.07)';
        ctx.lineWidth = i === 4 ? 1 : 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(CX - R, CY);
      ctx.lineTo(CX + R, CY);
      ctx.moveTo(CX, CY - R);
      ctx.lineTo(CX, CY + R);
      ctx.strokeStyle = 'rgba(26,86,255,0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      const trailSteps = 52;
      const trailLen = Math.PI * 0.68;
      for (let i = 0; i < trailSteps; i++) {
        const frac = i / trailSteps;
        const a = sweepAngle - trailLen * (1 - frac);
        const alpha = frac * frac * 0.16;
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R, a, a + trailLen / trailSteps);
        ctx.closePath();
        ctx.fillStyle = `rgba(26,86,255,${alpha})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(
        CX + Math.cos(sweepAngle) * R,
        CY + Math.sin(sweepAngle) * R
      );
      ctx.strokeStyle = 'rgba(26,86,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#1A56FF';
      ctx.shadowBlur = 7;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (mouseInside && mouseX > 0) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(26,86,255,0.55)';
        ctx.shadowColor = '#1A56FF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(26,86,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      const now = Date.now();
      blips = blips.filter(b => b.textLife > 0.01);
      blips.forEach(b => {
        const age = (now - b.born) / 1000;
        b.pulse = (b.pulse + 0.05) % 1;
        if (age >= 0.3) {
          b.textLife = Math.max(0, b.textLife - 0.003);
        }
        const alpha = b.textLife;

        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,86,255,${alpha * 0.9})`;
        ctx.shadowColor = '#1A56FF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        const pr = 6 + b.pulse * 22;
        const pa = (1 - b.pulse) * 0.35 * alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26,86,255,${pa})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (b.textLife > 0.05) {
          const tx = b.x + 11;
          const ty = b.y + 4;
          ctx.font = `400 10px 'JetBrains Mono', monospace`;
          const tw = ctx.measureText(b.text).width;
          const pad = 6;
          const bx = tx - pad;
          const by = ty - 12;
          const bw = tw + pad * 2;
          const bh = 18;

          ctx.fillStyle = `rgba(5,6,16,${alpha * 0.85})`;
          ctx.fillRect(bx, by, bw, bh);

          ctx.fillStyle = `rgba(26,86,255,${alpha * 0.25})`;
          ctx.fillRect(bx, by, bw, bh);

          ctx.strokeStyle = `rgba(26,86,255,${alpha * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(bx, by, bw, bh);

          ctx.fillStyle = `rgba(237,234,229,${alpha})`;
          ctx.fillText(b.text, tx, ty);
        }
      });

      ctx.restore();

      sweepSpeed += (targetSpeed - sweepSpeed) * 0.06;
      sweepAngle += sweepSpeed;

      rafId = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) rafId = requestAnimationFrame(draw);
    }, { threshold: 0 });
    io.observe(canvas);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="hero-radar-wrap">
      <canvas ref={canvasRef} className="hero-radar-canvas" />
    </div>
  );
}
