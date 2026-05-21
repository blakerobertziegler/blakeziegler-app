export const tokens = {
  color: {
    void: '#0D1117',
    surface: {
      '01': '#13161E',
      '02': '#181B24',
      '03': '#1E2130',
      '04': '#23273A',
    },
    accent: {
      blue: '#1A56FF',
      blueHover: '#2B6BFF',
      bluePress: '#0D40EE',
      blueDim: '#4B7BFF',
      glow: 'rgba(26,86,255,0.15)',
      soft: 'rgba(26,86,255,0.08)',
    },
    bg: {
      light: '#F0F2F5',
      mid: '#E4E8EF',
      surface: '#FFFFFF',
    },
    text: {
      pure: '#0A0C12',
      primary: '#1A1D27',
      secondary: '#4A5068',
      muted: '#8A91A8',
      white: '#FFFFFF',
      whiteSecondary: 'rgba(255,255,255,0.45)',
      whiteMuted: 'rgba(255,255,255,0.2)',
    },
    signal: {
      success: '#3BA55C',
      error: '#C44545',
      warn: '#D4A04C',
    },
    border: {
      subtle: 'rgba(26,86,255,0.12)',
      strong: 'rgba(26,86,255,0.25)',
      trace: 'rgba(26,86,255,0.15)',
    },
  },
  font: {
    display: `'Space Grotesk', system-ui, sans-serif`,
    body: `'Inter', system-ui, -apple-system, sans-serif`,
    mono: `'JetBrains Mono', 'SF Mono', Menlo, monospace`,
  },
  ease: {
    entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transition: 'cubic-bezier(0.65, 0, 0.35, 1)',
    exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
  },
  motion: {
    micro: 0.18,
    short: 0.4,
    medium: 0.6,
    long: 0.8,
    epic: 1.2,
  },
  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
} as const;

export type Tokens = typeof tokens;