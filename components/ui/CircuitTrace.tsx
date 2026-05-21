'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
}

interface Trace {
  points: Node[];
  progress: number;
  speed: number;
  opacity: number;
  pulseOffset: number;
}

export default function CircuitTrace({ width = 480, height = 480 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext('2d');
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const GRID = 32;
    const COLS = Math.floor(width / GRID);
    const ROWS = Math.floor(height / GRID);

    function snap(v: number, g: number) {
      return Math.round(v / g) * g;
    }

    function buildTrace(): Trace {
      const startX = snap(Math.random() * width * 0.3, GRID);
      const startY = snap(Math.random() * height, GRID);
      const points: Node[] = [{ x: startX, y: startY }];
      let cx = startX;
      let cy = startY;
      const steps = 4 + Math.floor(Math.random() * 8);

      for (let i = 0; i < steps; i++) {
        const dir = Math.random() < 0.5 ? 'h' : 'v';
        const dist = (1 + Math.floor(Math.random() * 4)) * GRID;
        if (dir === 'h') {
          cx = Math.max(0, Math.min(width, cx + (Math.random() < 0.7 ? dist : -dist)));
        } else {
          cy = Math.max(0, Math.min(height, cy + (Math.random() < 0.5 ? dist : -dist)));
        }
        points.push({ x: cx, y: cy });
      }

      return {
        points,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        opacity: 0.3 + Math.random() * 0.4,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    }

    // Build initial traces
    let traces: Trace[] = Array.from({ length: 14 }, buildTrace);
    // Stagger starts
    traces.forEach((t, i) => { t.progress = (i / traces.length); });

    function totalLength(points: Node[]) {
      let len = 0;
      for (let i = 1; i < points.length; i++) {
        len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      }
      return len;
    }

    function drawTrace(trace: Trace, t: number) {
      const { points, progress, opacity, pulseOffset } = trace;
      if (points.length < 2) return;

      const total = totalLength(points);
      const drawn = total * progress;

      ctx.beginPath();
      let accumulated = 0;
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const segLen = Math.hypot(
          points[i].x - points[i - 1].x,
          points[i].y - points[i - 1].y,
        );
        if (accumulated + segLen <= drawn) {
          ctx.lineTo(points[i].x, points[i].y);
          accumulated += segLen;
        } else {
          const rem = drawn - accumulated;
          const frac = rem / segLen;
          const ix = points[i - 1].x + (points[i].x - points[i - 1].x) * frac;
          const iy = points[i - 1].y + (points[i].y - points[i - 1].y) * frac;
          ctx.lineTo(ix, iy);
          break;
        }
      }

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.03 + pulseOffset);
      ctx.strokeStyle = `rgba(26, 86, 255, ${opacity * (0.6 + 0.4 * pulse)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw dot at head
      if (progress > 0 && progress < 1) {
        const lastPt = points[points.length - 1];
        let headX = points[0].x;
        let headY = points[0].y;
        let acc2 = 0;
        for (let i = 1; i < points.length; i++) {
          const segLen = Math.hypot(
            points[i].x - points[i - 1].x,
            points[i].y - points[i - 1].y,
          );
          if (acc2 + segLen <= drawn) {
            headX = points[i].x;
            headY = points[i].y;
            acc2 += segLen;
          } else {
            const rem = drawn - acc2;
            const frac = rem / segLen;
            headX = points[i - 1].x + (points[i].x - points[i - 1].x) * frac;
            headY = points[i - 1].y + (points[i].y - points[i - 1].y) * frac;
            break;
          }
        }
        ctx.beginPath();
        ctx.arc(headX, headY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(75, 123, 255, ${0.8 + 0.2 * pulse})`;
        ctx.fill();
      }

      // Draw via pads at each node
      for (const pt of points) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26, 86, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    let frame = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      frame++;

      ctx.clearRect(0, 0, width, height);

      traces = traces.map((trace) => {
        const next = { ...trace, progress: trace.progress + trace.speed };
        if (next.progress >= 1) {
          return { ...buildTrace(), progress: 0 };
        }
        return next;
      });

      traces.forEach((trace) => drawTrace(trace, frame));
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ display: 'block' }}
    />
  );
}
