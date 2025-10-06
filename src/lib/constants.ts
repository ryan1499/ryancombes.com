/**
 * Shared constants to maintain single source of truth
 * Update these values to change across the entire application
 */

import { X, Linkedin, Instagram, Youtube } from 'lucide-react'

// Social Media Links
export const SOCIAL_LINKS = [
  { 
    href: 'https://x.com/ryan_combes', 
    icon: X, 
    label: 'X',
    name: 'X (Twitter)'
  },
  { 
    href: 'https://www.linkedin.com/in/ryan-combes-a895b347', 
    icon: Linkedin, 
    label: 'LinkedIn',
    name: 'LinkedIn'
  },
  { 
    href: 'https://www.instagram.com/ryan_combes/', 
    icon: Instagram, 
    label: 'Instagram',
    name: 'Instagram'
  },
  { 
    href: 'https://www.youtube.com/@RyanCombes99', 
    icon: Youtube, 
    label: 'YouTube',
    name: 'YouTube'
  }
] as const

// Featured Posts Configuration - SINGLE SOURCE OF TRUTH
export const FEATURED_POST_SLUGS = [
  'the-cost-of-survival',
  'achievement-isnt-enough', 
  'power-is-not-love'
] as const

// Brand Copy and Metadata
export const BRAND_COPY = {
  author: {
    name: 'Ryan Combes',
    title: 'Writer & Storyteller',
    bio: 'I grew up in survivalist fear. Now I write about the courage to live.',
    tagline: 'Join me in exploring what it means to live brave enough.'
  },
  site: {
    name: 'Ryan Combes',
    url: 'https://ryancombes.com',
    description: 'Writer & Storyteller focused on courage, fear, identity, meaning, and authentic freedom',
    newsletter: {
      name: 'Brave Enough Newsletter',
      description: 'Weekly letters on building the courage that matters most.'
    }
  }
} as const

// API Configuration
export const API_CONFIG = {
  endpoints: {
    posts: '/api/posts',
    allPosts: '/api/posts/all',
    subscribe: '/api/subscribe'
  },
  cache: {
    homepage: 900, // 15 minutes
    archive: 3600, // 1 hour
    individual: 3600 // 1 hour
  }
} as const