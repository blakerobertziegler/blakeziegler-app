'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

interface FooterTrace {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  pulseOffset: number;
}

function buildFooterTrace(W: number, H: number, GRID: number): FooterTrace {
  const startX = Math.round((Math.random() * W) / GRID) * GRID;
  const startY = Math.round((Math.random() * H) / GRID) * GRID;
  const points = [{ x: startX, y: startY }];
  let cx = startX;
  let cy = startY;
  const steps = 5 + Math.floor(Math.random() * 9);
  for (let i = 0; i < steps; i++) {
    const horiz = Math.random() < 0.5;
    const dist = (1 + Math.floor(Math.random() * 5)) * GRID;
    if (horiz) cx = Math.max(0, Math.min(W, cx + (Math.random() < 0.6 ? dist : -dist)));
    else cy = Math.max(0, Math.min(H, cy + (Math.random() < 0.5 ? dist : -dist)));
    points.push({ x: cx, y: cy });
  }
  return {
    points,
    progress: Math.random(),
    speed: 0.0015 + Math.random() * 0.002,
    pulseOffset: Math.random() * Math.PI * 2,
  };
}

export default function FooterSection() {
  const year = new Date().getFullYear();
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isInView = useInView(ctaRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const GRID = 48;
    const TRACE_COUNT = 18;

    let W = 0;
    let H = 0;
    let traces: FooterTrace[] = [];

    const resize = () => {
      W = footer.offsetWidth;
      H = footer.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      traces = Array.from({ length: TRACE_COUNT }, () => buildFooterTrace(W, H, GRID));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(footer);
    resize();

    let frame = 0;
    let visible = true;
    const animate = () => {
      if (!visible) return;
      rafRef.current = requestAnimationFrame(animate);
      frame++;
      ctx.clearRect(0, 0, W, H);

      for (let t = 0; t < traces.length; t++) {
        const trace = traces[t];
        trace.progress += trace.speed;
        if (trace.progress >= 1) {
          traces[t] = buildFooterTrace(W, H, GRID);
          traces[t].progress = 0;
          continue;
        }

        const { points, progress, pulseOffset } = trace;
        if (points.length < 2) continue;

        // Compute total length
        let total = 0;
        for (let i = 1; i < points.length; i++) {
          total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
        }
        const drawn = total * progress;

        // Draw segments up to drawn length
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.02 + pulseOffset);
        const alpha = 0.15 * (0.7 + 0.3 * pulse);

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        let accumulated = 0;
        let headX = points[0].x;
        let headY = points[0].y;

        for (let i = 1; i < points.length; i++) {
          const segLen = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
          if (accumulated + segLen <= drawn) {
            ctx.lineTo(points[i].x, points[i].y);
            headX = points[i].x;
            headY = points[i].y;
            accumulated += segLen;
          } else {
            const frac = (drawn - accumulated) / segLen;
            headX = points[i - 1].x + (points[i].x - points[i - 1].x) * frac;
            headY = points[i - 1].y + (points[i].y - points[i - 1].y) * frac;
            ctx.lineTo(headX, headY);
            break;
          }
        }

        ctx.strokeStyle = `rgba(26, 86, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing head dot
        ctx.beginPath();
        ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 86, 255, ${alpha * 2.5})`;
        ctx.fill();

        // Via pads at nodes
        for (const pt of points) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(26, 86, 255, ${alpha * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) animate();
    }, { threshold: 0 });
    io.observe(footer);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <footer className="footer-section" ref={footerRef} style={{ position: 'relative' }}>
      {/* Circuit traces canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div className="footer-glow" aria-hidden />

      <div className="footer-inner" style={{ position: 'relative', zIndex: 1 }}>
        {/* CTA row — copy left, headshot right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '64px',
          alignItems: 'center',
          paddingBottom: '64px',
          borderBottom: '1px solid rgba(26,86,255,0.12)',
        }}>
          {/* Left: CTA copy */}
          <div
            ref={ctaRef}
            className="footer-cta"
            style={{ alignItems: 'flex-start', textAlign: 'left', borderBottom: 'none', paddingBottom: 0, gap: 0 }}
          >
            <motion.div className="mono-label" style={{ marginBottom: 20 }} {...fadeUp(0)}>
              // 004 — THE HANDSHAKE
            </motion.div>
            <motion.h2
              className="footer-cta-heading"
              style={{ color: '#ffffff', fontSize: 'clamp(24px, 3.6vw, 48px)', marginBottom: 16 }}
              {...fadeUp(0.1)}
            >
              Questions, ideas, or just
              <br />
              want in on the locked work?
            </motion.h2>
            <motion.p
              className="footer-cta-sub"
              style={{ marginLeft: 0, marginBottom: 32 }}
              {...fadeUp(0.18)}
            >
              LinkedIn works. So does the Get In Touch button.
            </motion.p>
            <motion.div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} {...fadeUp(0.26)}>
              <a
                href="https://linkedin.com/in/blakerobertziegler"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
              >
                LinkedIn →
              </a>
              <Link href="/contact" className="footer-btn">
                Get In Touch →
              </Link>
            </motion.div>
          </div>

          {/* Right: headshot */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: '2px solid #1A56FF',
              boxShadow: '0 0 0 6px rgba(26,86,255,0.08), 0 0 40px rgba(26,86,255,0.2)',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <Image
                src="/images/Ziegler_Headshot.jpeg"
                alt="Blake Ziegler"
                width={180}
                height={180}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.3)',
            }}>
              Blake R. Ziegler
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-wordmark">blakeziegler.app</div>

          <nav className="footer-links" aria-label="Footer links">
            <Link href="/work" className="footer-link">Work</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
            <a
              href="https://github.com/blakerobertziegler"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </nav>

          <span className="footer-copy">© {year} bz.</span>
        </div>
      </div>
    </footer>
  );
}
