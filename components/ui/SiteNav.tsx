'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SiteNav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav-logo" aria-label="Home">
        <Image
          src="/images/bz-logo.svg"
          alt="//bz."
          width={40}
          height={40}
          priority
        />
      </Link>
    </nav>
  );
}
