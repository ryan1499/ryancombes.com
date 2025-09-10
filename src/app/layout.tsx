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
  title: "Ryan Combes - Writer on Courage, Freedom, & Meaning",
  description: "Ryan Combes explores courage, freedom, and meaning through personal narrative. Weekly letters on spiritual depth, overcoming fear, and finding authentic freedom for ambitious young adults.",
  keywords: "personal growth, fear and courage, spiritual depth, meaning and identity, commitment, freedom, vulnerability, marriage, faith, ambition with integrity, storytelling, modern spirituality, resilience, young adults, authentic living, self-mastery",
  authors: [{ name: 'Ryan Combes', url: 'https://ryancombes.com' }],
  creator: 'Ryan Combes',
  publisher: 'Ryan Combes',
  metadataBase: new URL('https://ryancombes.com'),
  openGraph: {
    title: "Ryan Combes - Writer on Courage, Freedom, & Meaning",
    description: "Exploring courage, freedom, and meaning through personal narrative. Weekly letters on spiritual depth and authentic freedom for ambitious young adults.",
    url: 'https://ryancombes.com',
    siteName: 'Ryan Combes',
    type: 'website',
    images: [
      {
        url: '/profile.png',
        width: 400,
        height: 400,
        alt: 'Ryan Combes - Writer exploring courage, freedom, and meaning',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ryan Combes - Fear, Courage & Spiritual Depth",
    description: "Writer exploring courage, freedom, and meaning through personal narrative. Weekly letters on authentic freedom.",
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
    google: 'your-google-verification-code',
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
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://ryancombes.com/#person",
                  "name": "Ryan Combes",
                  "url": "https://ryancombes.com",
                  "image": {
                    "@type": "ImageObject",
                    "url": "https://ryancombes.com/profile.png",
                    "width": 400,
                    "height": 400
                  },
                  "description": "Writer and storyteller exploring courage, freedom, and meaning through personal narrative. Author of weekly letters on spiritual depth and authentic freedom.",
                  "jobTitle": "Writer & Storyteller",
                  "knowsAbout": [
                    "Personal Growth",
                    "Fear and Courage",
                    "Spiritual Depth",
                    "Identity and Self-Mastery",
                    "Authentic Living",
                    "Modern Spirituality",
                    "Vulnerability",
                    "Meaning and Purpose"
                  ],
                  "sameAs": [
                    "https://x.com/ryan_combes",
                    "https://www.linkedin.com/in/ryan-combes-a895b347",
                    "https://www.instagram.com/ryan_combes/",
                    "https://www.youtube.com/@RyanCombes99"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ryancombes.com/#website",
                  "url": "https://ryancombes.com",
                  "name": "Ryan Combes",
                  "description": "Writer exploring courage, freedom, and meaning through personal narrative",
                  "inLanguage": "en-US",
                  "publisher": {
                    "@id": "https://ryancombes.com/#person"
                  }
                },
                {
                  "@type": "Blog",
                  "@id": "https://ryancombes.com/#blog",
                  "url": "https://ryancombes.com",
                  "name": "Ryan Combes - Weekly Letters",
                  "description": "Weekly insights on courage, freedom, and meaning for ambitious young adults",
                  "inLanguage": "en-US",
                  "author": {
                    "@id": "https://ryancombes.com/#person"
                  },
                  "publisher": {
                    "@id": "https://ryancombes.com/#person"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${karla.variable} font-karla antialiased bg-brand-cream`}
      >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
