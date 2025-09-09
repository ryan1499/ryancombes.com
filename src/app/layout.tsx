import type { Metadata } from "next";
import { Playfair_Display, Karla } from 'next/font/google';
import "./globals.css";
import ConditionalNavbar from '../components/ConditionalNavbar';
import ConditionalFooter from '../components/ConditionalFooter';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "Ryan Combes - Brave Enough Newsletter | Personal Development & Authentic Living",
  description: "Weekly insights on overcoming fear, finding courage, and living with meaning. Join others exploring authentic personal development and what it means to live brave enough.",
  keywords: "personal development, overcoming fear, courage, authentic living, meaning, purpose, mindfulness, spirituality, self-improvement, growth mindset, mental health, newsletter",
  authors: [{ name: 'Ryan Combes', url: 'https://ryancombes.com' }],
  creator: 'Ryan Combes',
  publisher: 'Ryan Combes',
  metadataBase: new URL('https://ryancombes.com'),
  openGraph: {
    title: "Brave Enough Newsletter - Personal Development & Authentic Living",
    description: "Weekly insights on overcoming fear, finding courage, and living with meaning. Join others exploring what it means to live brave enough.",
    url: 'https://ryancombes.com',
    siteName: 'Brave Enough Newsletter',
    type: 'website',
    images: [
      {
        url: '/profile.png',
        width: 400,
        height: 400,
        alt: 'Ryan Combes - Author of Brave Enough Newsletter',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Brave Enough Newsletter - Personal Development & Authentic Living",
    description: "Weekly insights on overcoming fear, finding courage, and living with meaning.",
    creator: '@ryan_combes',
    images: ['/profile.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // You'll need to add this later
  },
  alternates: {
    canonical: 'https://ryancombes.com',
  },
  icons: {
    icon: '/profile.png',
    shortcut: '/profile.png',
    apple: '/profile.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.beehiiv.com" />
        <link rel="preload" href="/profile.png" as="image" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${playfair.variable} ${karla.variable} font-karla antialiased`}
        style={{backgroundColor: '#FAF8F2'}}
      >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
