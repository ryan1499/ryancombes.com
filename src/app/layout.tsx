import type { Metadata } from "next";
import { Playfair_Display, Karla } from 'next/font/google';
import "./globals.css";
import Navbar from '../components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ryan Combes - Brave Enough Newsletter",
  description: "Weekly insights on fear, courage, and meaning. Join thousands exploring what it means to live brave enough.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${karla.variable} font-karla antialiased`}
        style={{backgroundColor: '#FAF8F2'}}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
