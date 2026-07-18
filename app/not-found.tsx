import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not found',
};

export default function NotFound() {
  return (
    <div className="page">
      <div className="notfound">
        <p className="label">404</p>
        <h1 className="name">Nothing here.</h1>
        <p className="bio">That page doesn&apos;t exist.</p>
        <p className="row-detail" style={{ marginTop: 8 }}>
          <Link href="/">Back home</Link>
        </p>
      </div>
    </div>
  );
}
