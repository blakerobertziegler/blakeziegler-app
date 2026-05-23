import { Project } from '@/types/project';

export const counterlane: Project = {
  slug: 'counterlane',
  name: 'Project CounterLane',
  status: 'in-dev',
  locked: true,
  passwordHashEnvVar: 'OTTO_PASSWORD_HASH',
  publicDescription:
    'Automotive brokerage, restructured. Aggregates third-party vehicle data to take the headache out of buying a car.',
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
