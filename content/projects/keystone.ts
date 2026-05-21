import { Project } from '@/types/project';

export const keystone: Project = {
  slug: 'keystone',
  name: 'Project Keystone',
  status: 'qa',
  locked: true,
  passwordHashEnvVar: 'KEYSTONE_PASSWORD_HASH',
  publicDescription:
    'A quantitative equities ranking and trading system built on the loosened PDT rules. Long-only trading on a weekly and disciplined model.',
  index: 1,
  thumbnail: {
    static: '/projects/keystone/cover.jpg',
    motion: '/projects/keystone/preview.mp4',
  },
  meta: {
    role: 'Solo build',
    stack: ['Python', 'Polygon API', 'PostgreSQL'],
    timeline: '2025 — ongoing',
  },
};