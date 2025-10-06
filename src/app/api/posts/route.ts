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
  meta_default_description?: string;
};

interface TransformedPost {
  id: string;
  title: string;
  subtitle: string;
  excerpt?: string;
  publishedAt: string;
  slug: string;
  thumbnailUrl?: string;
  webUrl: string;
  tags: string[];
}

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

    // Fetch enough posts to ensure we get the featured ones (they might be older)
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts?status=confirmed&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { 
          revalidate: 900, // 15 minutes cache for list data
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
    
    // Featured post slugs - these are the ONLY posts we want for the homepage (optimized for performance)
    const featuredSlugs = ['the-cost-of-survival', 'achievement-isnt-enough', 'power-is-not-love'];
    
    // Transform and filter the data to match our frontend needs
    const allPosts: TransformedPost[] = data.data?.filter((post: BeehiivPost) => {
      // Only include posts that have been published (publish_date is in the past)
      if (!post.publish_date || typeof post.publish_date !== 'number') return false;
      const publishDate = new Date(post.publish_date * 1000); // Convert Unix timestamp (seconds) to milliseconds
      const now = new Date();
      return publishDate <= now;
    }).map((post: BeehiivPost): TransformedPost => {
      return {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle || '',
        excerpt: post.excerpt,
        publishedAt: post.publish_date!.toString(),
        slug: post.slug,
        thumbnailUrl: post.thumbnail_url,
        webUrl: post.web_url,
        tags: post.content_tags ? post.content_tags.slice(0, 3) : [],
        // readTime removed from preview cards
      };
    }) || [];

    // Return ONLY the featured posts in the specified order
    const posts = featuredSlugs.map(slug => 
      allPosts.find((post: TransformedPost) => post.slug === slug)
    ).filter((post): post is TransformedPost => Boolean(post));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

