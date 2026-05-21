import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { getProject, projects } from '@/lib/projects';
import { ProjectSection } from '@/types/project';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Blake Ziegler`,
    description: project.publicDescription,
  };
}

function renderSection(section: ProjectSection, i: number) {
  if (section.type === 'prose') {
    return (
      <p key={i} className="project-section-prose">
        {section.body}
      </p>
    );
  }
  if (section.type === 'image') {
    return (
      <div key={i} className="project-section-image">
        <Image src={section.src} alt={section.caption ?? ''} width={800} height={480} style={{ width: '100%', height: 'auto' }} />
        {section.caption && (
          <p className="project-section-caption">{section.caption}</p>
        )}
      </div>
    );
  }
  if (section.type === 'data') {
    return (
      <table key={i} className="project-data-table">
        <tbody>
          {section.rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (section.type === 'code') {
    return (
      <div key={i} className="project-code-block">
        <code>{section.body}</code>
      </div>
    );
  }
  return null;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  // Locked projects require the httpOnly cookie set by /api/unlock
  if (project.locked) {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get(`unlocked_${slug}`);
    if (!unlocked) {
      redirect(`/work/${slug}/unlock`);
    }
  }

  return (
    <div className="project-page">
      {/* Hero */}
      <div className="project-hero">
        {project.content?.hero?.src ? (
          <Image
            src={project.content.hero.src}
            alt={project.name}
            fill
            className="project-hero-img"
            priority
            unoptimized
          />
        ) : (
          <div className="project-hero-fallback">
            {project.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="project-hero-overlay" />
      </div>

      {/* Content */}
      <div className="project-content">
        <Link href="/work" className="work-page-back" style={{ display: 'inline-flex', marginBottom: 32 }}>
          ← Work
        </Link>

        <div className="mono-label" style={{ marginBottom: 16 }}>
          // {String(project.index).padStart(2, '0')} — {project.status.toUpperCase()}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          color: '#ffffff',
          marginBottom: 32,
        }}>
          {project.name}
        </h1>

        {/* Meta */}
        <div className="project-meta-row">
          <div className="project-meta-item">
            <span className="project-meta-label">Role</span>
            <span className="project-meta-value">{project.meta.role}</span>
          </div>
          <div className="project-meta-item">
            <span className="project-meta-label">Timeline</span>
            <span className="project-meta-value">{project.meta.timeline}</span>
          </div>
          <div className="project-meta-item">
            <span className="project-meta-label">Stack</span>
            <span className="project-meta-value">{project.meta.stack.join(', ')}</span>
          </div>
        </div>

        {/* Description */}
        <p className="project-section-prose">{project.publicDescription}</p>

        {/* Sections */}
        {project.content?.sections?.map((section, i) => renderSection(section, i))}
      </div>
    </div>
  );
}
