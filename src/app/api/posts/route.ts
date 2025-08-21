import { NextResponse } from 'next/server';

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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Beehiiv API Error:', response.status, errorText);
      throw new Error(`Beehiiv API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Transform the data to match our frontend needs
    const posts = data.data?.map((post: any) => {
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
  
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}