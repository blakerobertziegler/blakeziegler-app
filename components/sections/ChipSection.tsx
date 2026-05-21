'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import * as THREE from 'three';

const TAGS = ['Python', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'OpenAI API', 'Three.js', 'AI/ML', 'React Native', 'Docker'];
const DOT_COUNT = 10;
const GLOBE_RADIUS = 1.6;
const LERP = 0.06;
const MAX_ROT = 8;   // degrees

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

export default function ChipSection() {
  const canvasBackRef  = useRef<HTMLCanvasElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const portraitRef    = useRef<HTMLDivElement>(null);
  const sectionRef     = useRef<HTMLElement>(null);
  const rafRef         = useRef<number>(0);
  const portraitRafRef = useRef<number>(0);

  const cur = useRef({ rotY: 0, rotX: 0 });
  const tgt = useRef({ rotY: 0, rotX: 0 });

  // ── Portrait cursor tracking ───────────────────────────────────
  useEffect(() => {
    const section  = sectionRef.current;
    const portrait = portraitRef.current;
    if (!section || !portrait) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect   = portrait.getBoundingClientRect();
      const faceCx = rect.left + rect.width  * 0.5;
      const faceCy = rect.top  + rect.height * 0.35;

      const dx = e.clientX - faceCx;
      const dy = e.clientY - faceCy;

      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth  * 0.4)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.4)));

      tgt.current.rotY =  normX * MAX_ROT;
      tgt.current.rotX = -normY * MAX_ROT * 0.45;
    };

    const onMouseLeave = () => {
      tgt.current.rotY = 0;
      tgt.current.rotX = 0;
    };

    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      portraitRafRef.current = requestAnimationFrame(tick);
      cur.current.rotY += (tgt.current.rotY - cur.current.rotY) * LERP;
      cur.current.rotX += (tgt.current.rotX - cur.current.rotX) * LERP;

      if (portrait) {
        portrait.style.transform =
          `perspective(700px) rotateY(${cur.current.rotY}deg) rotateX(${cur.current.rotX}deg)`;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(portraitRafRef.current);
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // ── Three.js globe — back & front split ────────────────────────
  useEffect(() => {
    const canvasBack  = canvasBackRef.current;
    const canvasFront = canvasFrontRef.current;
    if (!canvasBack || !canvasFront) return;

    const makeRenderer = (canvas: HTMLCanvasElement, clipNormal: THREE.Vector3) => {
      const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      r.setClearColor(0x000000, 0);
      // World-space clipping plane: splits globe at z=0 (camera at z=5)
      r.clippingPlanes = [new THREE.Plane(clipNormal, 0)];
      return r;
    };

    // Back renderer keeps z ≤ 0 (rear hemisphere)
    const rendererBack  = makeRenderer(canvasBack,  new THREE.Vector3(0, 0, -1));
    // Front renderer keeps z ≥ 0 (near hemisphere)
    const rendererFront = makeRenderer(canvasFront, new THREE.Vector3(0, 0,  1));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 5;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x1a56ff, wireframe: true, transparent: true, opacity: 0.4 });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.97, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x1a56ff, transparent: true, opacity: 0.04 });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.08, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x1a56ff, transparent: true, opacity: 0.025, side: THREE.BackSide });
    globeGroup.add(new THREE.Mesh(haloGeo, haloMat));

    const dotMeshes: THREE.Mesh[] = [];
    const dotPhases: number[]    = [];
    const lats = [28, -12, 51, 35, -33, 40, 19, 55, -23, 48];
    const lons = [-80, -47, -1, 139, 151, 29, 73, 37, -43, 16];

    for (let i = 0; i < DOT_COUNT; i++) {
      const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x4b7bff, transparent: true, opacity: 0.9 });
      const dot    = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(latLonToVec3(lats[i], lons[i], GLOBE_RADIUS));
      globeGroup.add(dot);
      dotMeshes.push(dot);
      dotPhases.push(Math.random() * Math.PI * 2);
    }

    const resize = () => {
      const size = canvasBack.clientWidth;
      rendererBack.setSize(size, size, false);
      rendererFront.setSize(size, size, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvasBack);

    let t = 0;
    let visible = true;
    const animate = () => {
      if (!visible) return;
      rafRef.current = requestAnimationFrame(animate);
      t += 0.002;
      globeGroup.rotation.y = t;

      for (let i = 0; i < dotMeshes.length; i++) {
        const mat   = dotMeshes[i].material as THREE.MeshBasicMaterial;
        mat.opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.8 + dotPhases[i]));
        const sc    = 0.85 + 0.4 * Math.abs(Math.sin(t * 1.4 + dotPhases[i]));
        dotMeshes[i].scale.setScalar(sc);
      }

      rendererBack.render(scene, camera);
      rendererFront.render(scene, camera);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) animate();
    }, { threshold: 0 });
    io.observe(canvasBack);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      rendererBack.dispose();
      rendererFront.dispose();
      wireGeo.dispose(); wireMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      haloGeo.dispose(); haloMat.dispose();
      dotMeshes.forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
    };
  }, []);

  return (
    <section className="chip-section" ref={sectionRef}>
      <div className="chip-section-inner" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Copy — left */}
        <div className="chip-text">
          <div className="mono-label">// 002 — WHAT THIS IS</div>
          <h2 className="chip-heading">
            An archive with{' '}
            <em style={{ color: '#1A56FF', fontStyle: 'normal' }}>projects worth building.</em>
          </h2>
          <p className="chip-body">
            A personal index of real projects. Built to solve real problems, organized
            to show the work, open to the right people.
          </p>
          <div className="chip-tags">
            {TAGS.map((tag) => (
              <span key={tag} className="chip-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Globe + portrait — right */}
        <div
          className="chip-canvas-wrap"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Fixed-size container so absolute children can use inset: 0 */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 440, aspectRatio: '1' }}>

            {/* z:1 — rear hemisphere (behind portrait) */}
            <canvas
              ref={canvasBackRef}
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
            />

            {/* z:3 — portrait, faded to globe circle edges */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                maskImage: 'radial-gradient(ellipse 46% 50% at 50% 46%, black 38%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse 46% 50% at 50% 46%, black 38%, transparent 90%)',
              }}
            >
              {/* Sizing layer — controls how large the figure reads inside the globe */}
              <div
                style={{
                  position: 'absolute',
                  width: '58%',
                  aspectRatio: '3 / 4',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -56%)',
                }}
              >
                {/* 3D tracking */}
                <div
                  ref={portraitRef}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    willChange: 'transform',
                    transformOrigin: 'center center',
                  }}
                >
                  <Image
                    src="/images/blake-cutout.png"
                    alt="Blake Ziegler"
                    fill
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'center top',
                      opacity: 0.60,
                    }}
                    priority
                  />
                </div>
              </div>
            </div>

            {/* z:4 — front hemisphere (in front of portrait) */}
            <canvas
              ref={canvasFrontRef}
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}
            />

          </div>
        </div>

      </div>
    </section>
  );
}
