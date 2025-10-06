/**
 * Shared type definitions
 * Single source of truth for all data structures
 */

// Core Post type used across the application
export interface Post {
  id: string
  title: string
  subtitle: string
  slug: string
  publishedAt: string
  thumbnailUrl?: string
  webUrl: string
  tags: string[]
  content?: string
  readTime?: string
  excerpt?: string
}

// API Response types
export interface PostsResponse {
  posts: Post[]
}

// Beehiiv API types (for internal API routes)
export interface BeehiivPost {
  id: string
  title: string
  subtitle?: string
  slug: string
  published_at: number
  publish_date?: string
  web_url: string
  thumbnail_url?: string
  excerpt?: string
  content_tags?: string[]
  content?: { 
    free?: { 
      web?: string 
    } 
  }
  free_web_content?: string
  content_html?: string
  meta_default_description?: string
}

// Transformed Post type (alias for Post with specific fields for API responses)
export interface TransformedPost {
  id: string
  title: string
  subtitle: string
  excerpt?: string
  publishedAt: string
  slug: string
  thumbnailUrl?: string
  webUrl: string
  tags: string[]
}

// Social Link type
export interface SocialLink {
  href: string
  icon: React.ComponentType<{ size?: number }> // lucide-react icon component
  label: string
  name: string
}

// Newsletter subscription types
export interface SubscribeRequest {
  email: string
}

export interface SubscribeResponse {
  success?: boolean
  error?: string
  message?: string
}

// SEO and metadata types
export interface PageMetadata {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}