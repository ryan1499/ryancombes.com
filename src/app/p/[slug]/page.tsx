import { Metadata } from 'next'
import Link from 'next/link'
import PostClient from './PostClient'

type Post = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  readTime: string;
  tags: string[];
  slug: string;
  publishedAt: string;
  thumbnailUrl?: string;
  webUrl: string;
};

async function getPost(slug: string): Promise<Post | null> {
  try {
    // Fetch directly from Beehiiv API instead of internal API route
    const apiKey = process.env.BEEHIIV_API_KEY;
    if (!apiKey) {
      console.error('Beehiiv API key not found');
      return null;
    }

    // First get the post from the posts list
    const postsResponse = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_d7682eb0-5603-434c-8b88-35690c42c08a/posts?limit=100&expand=free_web_content',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!postsResponse.ok) {
      console.error(`Beehiiv API error: ${postsResponse.status}`);
      return null;
    }

    const postsData = await postsResponse.json();
    const post = postsData.data?.find((p: { slug: string }) => p.slug === slug);

    if (!post) {
      return null;
    }

    // Get the full post content
    const postResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_d7682eb0-5603-434c-8b88-35690c42c08a/posts/${post.id}?expand=free_web_content`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!postResponse.ok) {
      console.error(`Beehiiv post API error: ${postResponse.status}`);
      return null;
    }

    const fullPostData = await postResponse.json();
    const fullPost = fullPostData.data;

    // Extract and clean the HTML content
    const rawHtml = fullPost.content?.free?.web || 
                    fullPost.free_web_content || 
                    fullPost.content_html || 
                    '';

    // Simple content extraction - remove Beehiiv headers and footers
    let cleanedContent = rawHtml;
    if (rawHtml) {
      // Remove common Beehiiv wrapper elements
      cleanedContent = rawHtml
        .replace(/<div[^>]*class="[^"]*email-wrapper[^"]*"[^>]*>/gi, '<div>')
        .replace(/<div[^>]*class="[^"]*rendered-post[^"]*"[^>]*>/gi, '<div>')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<div[^>]*class="[^"]*post-header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    }

    // Estimate read time
    function estimateReadTime(content: string): string {
      if (!content) return '1 min read';
      
      const textContent = content
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const wordsPerMinute = 200;
      const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
      const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
      
      return `${minutes} min read`;
    }

    return {
      id: fullPost.id,
      title: fullPost.title,
      subtitle: fullPost.subtitle || '',
      content: cleanedContent,
      readTime: estimateReadTime(cleanedContent),
      tags: fullPost.content_tags || [],
      slug: fullPost.slug,
      publishedAt: fullPost.published_at?.toString() || fullPost.created?.toString() || '',
      thumbnailUrl: fullPost.thumbnail_url,
      webUrl: fullPost.web_url,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

function generateMetaDescription(post: Post): string {
  // Extract first 150-160 characters from subtitle or content for SEO
  if (post.subtitle && post.subtitle.length > 20) {
    return post.subtitle.length > 160 
      ? post.subtitle.substring(0, 157) + '...'
      : post.subtitle;
  }
  
  // Fallback to content excerpt
  const contentText = post.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Replace HTML entities
    .trim();
  
  return contentText.length > 160 
    ? contentText.substring(0, 157) + '...'
    : contentText;
}

function extractKeywords(post: Post): string[] {
  const keywords = ['personal development', 'courage', 'fear', 'meaning', 'authentic living'];
  
  // Add dynamic keywords based on title
  const titleWords = post.title.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 3);
  
  return [...keywords, ...titleWords].slice(0, 8);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Ryan Combes',
      description: 'The requested post could not be found.',
    };
  }

  const metaDescription = generateMetaDescription(post);
  const keywords = extractKeywords(post);
  
  return {
    title: `${post.title} | Ryan Combes - Brave Enough Newsletter`,
    description: metaDescription,
    keywords: keywords.join(', '),
    authors: [{ name: 'Ryan Combes', url: 'https://ryancombes.com' }],
    creator: 'Ryan Combes',
    publisher: 'Ryan Combes',
    openGraph: {
      title: post.title,
      description: metaDescription,
      url: `https://ryancombes.com/p/${post.slug}`,
      siteName: 'Brave Enough Newsletter',
      type: 'article',
      publishedTime: new Date(parseInt(post.publishedAt) * 1000).toISOString(),
      authors: ['Ryan Combes'],
      images: post.thumbnailUrl ? [
        {
          url: post.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: 'https://ryancombes.com/profile.png',
          width: 400,
          height: 400,
          alt: 'Ryan Combes',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      creator: '@ryan_combes',
      images: post.thumbnailUrl ? [post.thumbnailUrl] : ['https://ryancombes.com/profile.png'],
    },
    alternates: {
      canonical: `https://ryancombes.com/p/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FAF8F2'}}>
        <div className="text-center">
          <h1 className="text-2xl font-playfair mb-4" style={{color: '#1F1F1F'}}>Post Not Found</h1>
          <p style={{color: '#5A5856'}}>The post you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/" 
            className="inline-block mt-4 px-6 py-2 rounded-lg text-white"
            style={{backgroundColor: '#747C5DFF'}}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <PostClient post={post} />;
}