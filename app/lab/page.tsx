import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Live experiments I build and ship.',
};

export default function Lab() {
  return (
    <div className="page">
      <header>
        <p className="row-detail" style={{ marginBottom: 20 }}>
          <Link href="/">← Blake Ziegler</Link>
        </p>
        <p className="label">Lab</p>
        <h1 className="name">In the lab.</h1>
        <p className="bio">
          Things I build and ship on my own. Everything here is live and
          clickable. If it is not running, it is not on this page.
        </p>
      </header>

      <section className="section" aria-label="Experiments">
        <div className="rows">
          <div>
            <p className="row-title">ForkBrain</p>
            <p className="row-detail">
              Answer 12 quick questions, get one restaurant. It kills dining
              decision fatigue with a single pick and two re-rolls.{' '}
              <a
                href="https://apps.apple.com/app/id6776676438"
                target="_blank"
                rel="noopener noreferrer"
              >
                App Store
              </a>
            </p>
            <p className="label" style={{ marginTop: 8, marginBottom: 0 }}>
              iOS · Food &amp; Drink
            </p>
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>
          <Link href="/">blakeziegler.app</Link>
        </span>
        <span>© {new Date().getFullYear()} Blake Ziegler</span>
      </footer>
    </div>
  );
}
