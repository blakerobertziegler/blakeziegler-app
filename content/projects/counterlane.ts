import { Project } from '@/types/project';

export const counterlane: Project = {
  slug: 'counterlane',
  name: 'Project CounterLane',
  status: 'in-dev',
  locked: true,
  passwordHashEnvVar: 'OTTO_PASSWORD_HASH',
  publicDescription:
    'An algorithmic pricing layer for the automotive market that gives buyers a confident, data-backed offer range before they even contact a dealership.',
  index: 2,
  thumbnail: {
    static: '/projects/counterlane/cover.png',
    motion: '/projects/counterlane/preview.mp4',
  },
  meta: {
    role: 'Solo build',
    stack: ['TypeScript', 'Next.js', 'Redis'],
    timeline: '2026 — ongoing',
  },
  content: {
    hero: { type: 'image', src: '/projects/counterlane/cover.png' },
    sections: [],
  },
};
