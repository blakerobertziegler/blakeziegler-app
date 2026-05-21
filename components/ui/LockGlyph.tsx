import { Lock } from 'lucide-react';

interface LockGlyphProps {
  size?: number;
}

export default function LockGlyph({ size = 12 }: LockGlyphProps) {
  return (
    <div className="lock-glyph" aria-label="Password protected">
      <Lock size={size} color="#4B7BFF" strokeWidth={2} />
    </div>
  );
}
