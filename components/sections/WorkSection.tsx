'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Project } from '@/types/project';
import RitualCard from '@/components/ui/RitualCard';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseVx: number;
  baseVy: number;
}

interface WorkSectionProps {
  projects: Project[];
}

export default function WorkSection({ projects }: WorkSectionProps) {
  const featured = projects.slice(0, 3);
  const cardsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isInView = useInView(cardsRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const PARTICLE_COUNT = 80;
    const REPULSION_RADIUS = 120;
    const REPULSION_STRENGTH = 2.5;
    const DAMPING = 0.92;

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];

    const resize = () => {
      W = section.offsetWidth;
      H = section.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
    };

    const spawn = (): Particle => {
      const speed = 0.08 + Math.random() * 0.12;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: 1.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.2,
      };
    };

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, spawn);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', onMouseLeave);

    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(section);

    let visible = true;
    const animate = () => {
      if (!visible) return;
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx = p.vx * DAMPING + p.baseVx * (1 - DAMPING);
        p.vy = p.vy * DAMPING + p.baseVy * (1 - DAMPING);
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 86, 255, ${p.opacity})`;
        ctx.fill();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) animate();
    }, { threshold: 0 });
    io.observe(section);

    init();
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <section className="work-section" ref={sectionRef} style={{ position: 'relative' }}>
      {/* Particle field canvas */}
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

      {/* Content sits above canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="work-section-header">
          <div>
            <div className="mono-label" style={{ marginBottom: 16 }}>// 003 — THE WORK</div>
            <h2 className="work-section-title">Blake&apos;s Active<br />Projects.</h2>
          </div>
          <Link href="/work" className="work-all-link">
            All projects →
          </Link>
        </div>

        <div className="work-cards" ref={cardsRef}>
          {featured.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <RitualCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
