import type { Metadata } from 'next';
import './globals.css';
import SiteNav from '@/components/ui/SiteNav';

export const metadata: Metadata = {
  title: 'Blake Ziegler — Build. Ship.',
  description: 'Personal project repository. Builder. Operator. Ships.',
  metadataBase: new URL('https://blakeziegler.app'),
  openGraph: {
    title: 'Blake Ziegler — Build. Ship.',
    description: 'Personal project repository. Builder. Operator. Ships.',
    url: 'https://blakeziegler.app',
    siteName: 'Blake Ziegler',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blake Ziegler — Build. Ship.',
    description: 'Personal project repository. Builder. Operator. Ships.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'NfHGRR-BfPFgsxuS-OEk70Dvngmh0pEqk3WcSjKN0Nk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}