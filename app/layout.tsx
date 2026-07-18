import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const title = 'Blake Ziegler';
const description =
  'I lead AI strategy and implementation across enterprise transformation and independent products.';

export const metadata: Metadata = {
  title: {
    default: 'Blake Ziegler — AI Strategy & Implementation',
    template: '%s — Blake Ziegler',
  },
  description,
  metadataBase: new URL('https://blakeziegler.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: 'https://blakeziegler.app',
    siteName: 'Blake Ziegler',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: { index: true, follow: true },
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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
