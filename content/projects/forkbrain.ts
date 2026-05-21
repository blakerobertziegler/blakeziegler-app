import { Project } from '@/types/project';

export const forkBrain: Project = {
  slug: 'forkbrain',
  name: 'Project ForkBrain',
  status: 'in-dev',
  locked: false,
  publicDescription:
    'A restaurant recommendation app that picks your next spot based on your mood and a few simple questions. No more "I don\'t know, you pick."',
  index: 3,
  thumbnail: {
    static: '/projects/forkbrain/cover.jpg',
    motion: '/projects/forkbrain/preview.mp4',
  },
  meta: {
    role: 'Weekend build',
    stack: ['React', 'TypeScript', 'Supabase'],
    timeline: '2026 — ongoing',
  },
};
