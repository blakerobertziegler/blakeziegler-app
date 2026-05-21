'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import HeroRadar from './HeroRadar';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Three.js icosahedron wireframe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4;

    // Inner solid icosahedron (very faint fill)
    const solidGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const solidMat = new THREE.MeshBasicMaterial({
      color: 0x1a56ff,
      transparent: true,
      opacity: 0.025,
    });
    const solidMesh = new THREE.Mesh(solidGeo, solidMat);
    scene.add(solidMesh);

    // Outer wireframe icosahedron
    const wireGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1a56ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Second larger, slower wireframe for depth
    const outerGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x4b7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    const resize = () => {
      const size = canvas.clientWidth;
      renderer.setSize(size, size, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mouseX = 0;
    let mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    let t = 0;
    let visible = true;
    const animate = () => {
      if (!visible) return;
      rafRef.current = requestAnimationFrame(animate);
      t += 0.004;

      wireMesh.rotation.x = t * 0.6 + mouseY * 0.3;
      wireMesh.rotation.y = t + mouseX * 0.3;
      solidMesh.rotation.copy(wireMesh.rotation);

      outerMesh.rotation.x = -t * 0.2;
      outerMesh.rotation.y = t * 0.35;

      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) animate();
    }, { threshold: 0 });
    io.observe(canvas);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMouse);
      renderer.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      solidGeo.dispose();
      solidMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
    };
  }, []);

  // Mouse parallax on figure
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!figureRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      figureRef.current.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-vignette" />
      <div className="hero-glow" />

      {/* Three.js canvas centered in the hero */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{ opacity: 0.85 }}
        aria-hidden
      />

      <div className="hero-figure" ref={figureRef}>
        <HeroRadar />
      </div>

      <div className="hero-content">
        <div className="mono-label">// 001 — BLAKE ZIEGLER</div>
        <h1 className="hero-name">
          <span style={{ whiteSpace: 'nowrap' }}>BLAKE R.</span>
          <br />
          ZIEGLER
        </h1>
        <p className="hero-headline" style={{ color: '#1A56FF' }}>Build. Ship.</p>
        <p className="hero-sub">Personal repository. 3 projects and counting.</p>
      </div>

      <div className="scroll-cue" aria-hidden>
        <span>SCROLL</span>
        <div className="scroll-cue-line" />
      </div>
    </section>
  );
}
