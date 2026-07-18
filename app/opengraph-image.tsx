import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Blake Ziegler — AI Strategy & Implementation';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0b0d11',
          color: '#edeef2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 64, height: 6, background: '#5e8bff', marginBottom: 44 }} />
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: '-0.03em' }}>
          Blake Ziegler
        </div>
        <div style={{ fontSize: 34, color: '#5e8bff', marginTop: 20, maxWidth: 900 }}>
          I lead AI strategy and implementation.
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#676d7a',
            marginTop: 'auto',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          blakeziegler.app
        </div>
      </div>
    ),
    size,
  );
}
