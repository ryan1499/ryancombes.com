import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Ryan Combes - Writer & Storyteller | Fear, Courage & Spiritual Depth",
  description: "Ryan Combes's journey from fear to freedom. Writer exploring courage, identity, and meaning through personal narrative. From childhood paranoia to authentic living and spiritual depth.",
  keywords: "Ryan Combes, personal story, fear and courage, spiritual journey, authentic living, overcoming childhood trauma, paranoia, freedom, meaning, writer biography, personal development story",
  openGraph: {
    title: "About Ryan Combes - From Fear to Freedom",
    description: "Ryan's journey from childhood paranoia to authentic living. Writer exploring fear, courage, identity, and meaning through personal narrative.",
    url: 'https://ryancombes.com/about',
    type: 'profile',
    images: [
      {
        url: '/profile.png',
        width: 400,
        height: 400,
        alt: 'Ryan Combes - Writer exploring fear, courage, and spiritual depth',
      }
    ],
  },
  twitter: {
    title: "About Ryan Combes - From Fear to Freedom",
    description: "Ryan's journey from childhood paranoia to authentic living. Writer exploring fear, courage, and meaning.",
  },
  alternates: {
    canonical: 'https://ryancombes.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}