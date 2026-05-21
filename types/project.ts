export type Project = {
  slug: string;
  name: string;
  status: 'live' | 'in-dev' | 'archived' | 'qa';
  locked: boolean;
  passwordHashEnvVar?: string;
  publicDescription: string;
  index: number;
  thumbnail: {
    static: string;
    motion?: string;
  };
  meta: {
    role: string;
    stack: string[];
    timeline: string;
  };
  content?: {
    hero: { type: 'image' | 'video'; src: string };
    sections: ProjectSection[];
  };
};

export type ProjectSection =
  | { type: 'prose'; body: string }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'data'; rows: { label: string; value: string }[] }
  | { type: 'code'; language: string; body: string };