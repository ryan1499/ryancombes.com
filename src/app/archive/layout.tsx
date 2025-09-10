import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archive - All Letters by Ryan Combes | Fear, Courage & Spiritual Depth",
  description: "Complete archive of weekly letters by Ryan Combes exploring fear, courage, identity, and meaning. Stories on spiritual depth, authentic freedom, and personal growth for ambitious young adults.",
  keywords: "Ryan Combes archive, weekly letters, fear and courage, spiritual depth, personal growth, authentic living, meaning and identity, storytelling, modern spirituality, vulnerability",
  openGraph: {
    title: "Archive - All Letters by Ryan Combes",
    description: "Complete archive of weekly letters exploring fear, courage, identity, and meaning through personal narrative and spiritual depth.",
    url: 'https://ryancombes.com/archive',
    type: 'website',
    images: [
      {
        url: '/profile.png',
        width: 400,
        height: 400,
        alt: 'Ryan Combes - Archive of letters on fear, courage, and spiritual depth',
      }
    ],
  },
  twitter: {
    title: "Archive - All Letters by Ryan Combes",
    description: "Complete archive of weekly letters exploring fear, courage, identity, and meaning through personal narrative.",
  },
  alternates: {
    canonical: 'https://ryancombes.com/archive',
  },
}

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}