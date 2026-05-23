import { keystone } from '@/content/projects/keystone';
import { counterlane } from '@/content/projects/counterlane';
import { forkBrain } from '@/content/projects/forkbrain';
import { Project } from '@/types/project';

export const projects: Project[] = [
  keystone,
  counterlane,
  forkBrain,
].sort((a, b) => a.index - b.index);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPublicProjects(): Project[] {
  return projects.filter((p) => !p.locked);
}

export function getLockedProjects(): Project[] {
  return projects.filter((p) => p.locked);
}