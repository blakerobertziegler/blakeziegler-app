'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LockGlyph from '@/components/ui/LockGlyph';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function UnlockPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/work/${slug}`);
      } else {
        setError(data.message ?? 'Wrong password. Try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unlock-page">
      <div className="unlock-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LockGlyph size={14} />
          <div className="mono-label">// RESTRICTED</div>
        </div>

        <div>
          <h1 className="unlock-title">Password required</h1>
          <p className="unlock-subtitle">
            This project is behind an NDA or selective access. Enter the password
            to continue.
          </p>
        </div>

        <form className="unlock-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="unlock-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            disabled={loading}
          />
          {error && <div className="unlock-error">{error}</div>}
          <button
            type="submit"
            className="unlock-submit"
            disabled={loading || password.length === 0}
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>

        <Link href="/work" className="unlock-back">
          ← Back to work
        </Link>
      </div>
    </div>
  );
}
