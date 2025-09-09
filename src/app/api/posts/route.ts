import { NextResponse } from 'next/server'

interface BeehiivPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  published_at: number;
  publish_date?: string;
  web_url: string;
  thumbnail_url?: string;
  excerpt?: string;
  content_tags?: string[];
  content?: { free?: { web?: string } };
  free_web_content?: string;
  content_html?: string;
};

export async function GET() {
  try {
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      return NextResponse.json(
        { error: 'Missing Beehiiv API credentials' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts?status=confirmed&limit=100&expand=free_web_content`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { 
          revalidate: 300, // 5 minutes cache
          tags: ['posts']
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Beehiiv API Error:', response.status, errorText);
      throw new Error(`Beehiiv API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Transform and filter the data to match our frontend needs
    const posts = data.data?.filter((post: BeehiivPost) => {
      // Only include posts that have been published (publish_date is in the past)
      if (!post.publish_date || typeof post.publish_date !== 'number') return false;
      const publishDate = new Date(post.publish_date * 1000); // Convert Unix timestamp (seconds) to milliseconds
      const now = new Date();
      return publishDate <= now;
    }).map((post: BeehiivPost) => {
      // Extract HTML content if available
      const htmlContent = post.content?.free?.web || post.free_web_content || post.content_html || '';
      
      return {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle || '',
        content: htmlContent,
        excerpt: post.excerpt,
        publishedAt: post.publish_date,
        slug: post.slug,
        thumbnailUrl: post.thumbnail_url,
        webUrl: post.web_url,
        tags: post.content_tags || [],
        readTime: estimateReadTime(htmlContent || post.title),
      };
    }) || [];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

function estimateReadTime(content: string): string {
  if (!content) return '1 min read';
  
  // Strip HTML tags and decode entities to get plain text
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Replace HTML entities with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const wordsPerMinute = 200;
  const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return `${minutes} min read`;
}