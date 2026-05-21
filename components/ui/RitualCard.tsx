'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import LockGlyph from './LockGlyph';

interface RitualCardProps {
  project: Project;
}

export default function RitualCard({ project }: RitualCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const href = project.locked
    ? `/work/${project.slug}/unlock`
    : `/work/${project.slug}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  };

  const statusLabel: Record<Project['status'], string> = {
    live: 'Live',
    'in-dev': 'In dev',
    archived: 'Archived',
    qa: 'QA',
  };

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        ref={cardRef}
        className="ritual-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: 'transform 0.08s linear, border-color 0.3s' }}
      >
        {/* Thumbnail */}
        <div className="ritual-card-thumb">
          {project.thumbnail?.static ? (
            <Image
              src={project.thumbnail.static}
              alt={project.name}
              fill
              className="ritual-card-thumb-img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="ritual-card-thumb-fallback">
              {project.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="ritual-card-overlay" />
          {project.locked && (
            <div className="ritual-card-lock">
              <LockGlyph />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="ritual-card-body">
          <div className="ritual-card-index">
            {String(project.index).padStart(2, '0')}
          </div>
          <div className="ritual-card-name">{project.name}</div>
          <div className="ritual-card-desc">{project.publicDescription}</div>
          <div className="ritual-card-meta">
            <span className={`ritual-card-status ${project.status}`}>
              {statusLabel[project.status]}
            </span>
            {project.meta.stack.slice(0, 3).map((s) => (
              <span key={s} className="ritual-card-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
