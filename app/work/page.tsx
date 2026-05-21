import Link from 'next/link';
import { projects } from '@/lib/projects';
import RitualCard from '@/components/ui/RitualCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work — Blake Ziegler',
  description: 'All projects. Built, shipped, and still running.',
};

export default function WorkPage() {
  return (
    <div className="work-page">
      <div className="work-page-header">
        <Link href="/" className="work-page-back">
          ← Home
        </Link>
        <div className="mono-label" style={{ marginBottom: 16 }}>// ALL WORK</div>
        <h1 className="work-page-title">The Work</h1>
      </div>

      <div className="work-page-grid">
        {projects.map((project) => (
          <RitualCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
