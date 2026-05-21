import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Blake Ziegler',
};

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-inner">
        <div className="mono-label">// 404 — NOT FOUND</div>
        <div className="not-found-code" aria-hidden>404</div>
        <h1 className="not-found-title">Nothing here.</h1>
        <p className="not-found-sub">
          That page doesn&apos;t exist, was removed, or never shipped.
        </p>
        <Link href="/" className="not-found-btn">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
