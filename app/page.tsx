import Image from 'next/image';
import Link from 'next/link';

const LINKEDIN = 'https://www.linkedin.com/in/blakerobertziegler';
const EMAIL = 'blake@blakeziegler.app';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Blake Ziegler',
  jobTitle: 'AI Strategy Lead',
  description:
    'AI strategy and implementation leader working across enterprise transformation and independent products.',
  url: 'https://blakeziegler.app',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Southern New Hampshire University',
  },
  sameAs: [LINKEDIN, 'https://bzsystems.io'],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
        }}
      />

      <div className="page">
        <header>
          <Image
            src="/images/Ziegler_Headshot.jpeg"
            alt="Blake Ziegler"
            width={76}
            height={76}
            className="avatar"
            priority
          />
          <h1 className="name">Blake Ziegler</h1>
          <p className="positioning">
            I lead AI strategy and implementation, across enterprise
            transformation and independent products.
          </p>
          <p className="bio">
            I work where AI strategy meets hands-on building. Today I lead
            company-wide AI transformation at an employee-owned manufacturers rep
            firm, and I run my own AI product studio. My background spans
            quantitative analytics and operations. I care about systems that ship
            and hold up in production.
          </p>
        </header>

        <section className="section" aria-label="Now">
          <p className="label">Now</p>
          <div className="rows">
            <div>
              <p className="row-title">AI Strategy Lead, Ketchum &amp; Walton</p>
              <p className="row-detail">
                Leading company-wide AI transformation for an employee-owned
                manufacturers rep firm.
              </p>
            </div>
            <div>
              <p className="row-title">Founder, BZ Systems</p>
              <p className="row-detail">
                An AI product studio.{' '}
                <a href="https://bzsystems.io" target="_blank" rel="noopener noreferrer">
                  bzsystems.io
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Credentials">
          <p className="label">Credentials</p>
          <p className="creds">
            MBA, Quantitative Analytics, SNHU
            <span className="sep">·</span>
            Certified Kaizen Facilitator, MSI
            <span className="sep">·</span>
            Anthropic AI Fluency certifications, 2026
            {/* Certified Claude Application Facilitator (CCA-F) — flip on when passed */}
          </p>
          <p className="row-detail" style={{ marginTop: 14 }}>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </section>

        <section className="section" aria-label="Selected work">
          <p className="label">Selected work</p>
          <p className="row-detail">
            My shipped product work lives at BZ Systems.{' '}
            <a href="https://bzsystems.io" target="_blank" rel="noopener noreferrer">
              bzsystems.io
            </a>
          </p>
        </section>

        <section className="section" aria-label="Lab">
          <p className="label">Lab</p>
          <p className="row-detail">
            Live experiments I build and ship on my own.{' '}
            <Link href="/lab">See the lab</Link>
          </p>
        </section>

        <section className="section" aria-label="Contact">
          <p className="label">Contact</p>
          <div className="contact-links">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        <footer className="foot">
          <span>blakeziegler.app</span>
          <span>© {new Date().getFullYear()} Blake Ziegler</span>
        </footer>
      </div>
    </main>
  );
}
