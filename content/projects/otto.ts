import { Project } from '@/types/project';

export const otto: Project = {
  slug: 'otto',
  name: 'Project Otto',
  status: 'in-dev',
  locked: true,
  passwordHashEnvVar: 'OTTO_PASSWORD_HASH',
  publicDescription:
    'Automotive brokerage, restructured. Aggregates third-party vehicle data to take the headache out of buying a car.',
  index: 2,
  thumbnail: {
    static: '/projects/otto/cover.jpg',
    motion: '/projects/otto/preview.mp4',
  },
  meta: {
    role: 'Solo build',
    stack: ['TypeScript', 'Next.js', 'Redis'],
    timeline: '2026 — ongoing',
  },
  content: {
    hero: { type: 'image', src: '/projects/otto/cover.jpg' },
    sections: [],
  },
};