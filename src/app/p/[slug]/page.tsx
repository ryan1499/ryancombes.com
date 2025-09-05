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

    // Check if post is published (publish_date is in the past)
    if (post.publish_date) {
      const publishDate = new Date(post.publish_date);
      const now = new Date();
      if (publishDate > now) {
        return null; // Post is scheduled for future, don't show it
      }
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

    // Clean the HTML content while preserving structure
    let cleanedContent = rawHtml;
    if (rawHtml) {
      // Remove Beehiiv specific wrapper classes but preserve div structure
      cleanedContent = rawHtml
        // Remove style attributes but keep the HTML structure
        .replace(/style="[^"]*"/gi, '')
        // Remove class attributes but keep the HTML structure  
        .replace(/class="[^"]*"/gi, '')
        // Remove Beehiiv specific elements
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        // Remove images (profile pictures)
        .replace(/<img[^>]*>/gi, '')
        // Remove duplicate title and subtitle content
        .replace(new RegExp(fullPost.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '')
        .replace(new RegExp((fullPost.subtitle || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '')
        // Remove author info patterns
        .replace(/Ryan Combes/gi, '')
        .replace(/By Ryan Combes/gi, '')
        // Remove date patterns (more comprehensive)
        .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/gi, '')
        .replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/gi, '')
        .replace(/\b\d{4}-\d{2}-\d{2}\b/gi, '')
        .replace(/\d+ min read/gi, '')
        // Remove social sharing elements
        .replace(/<a[^>]*href[^>]*facebook[^>]*>[\s\S]*?<\/a>/gi, '')
        .replace(/<a[^>]*href[^>]*twitter[^>]*>[\s\S]*?<\/a>/gi, '')
        .replace(/<a[^>]*href[^>]*linkedin[^>]*>[\s\S]*?<\/a>/gi, '')
        .replace(/<a[^>]*href[^>]*share[^>]*>[\s\S]*?<\/a>/gi, '')
        // Remove SVG icons (social sharing icons)
        .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
        // Remove button elements
        .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
        // Remove social sharing icons/dividers
        .replace(/<div[^>]*>[\s]*<\/div>/gi, '') // Remove empty divs
        .replace(/━+/g, '') // Remove line dividers
        .replace(/[\u2500-\u257F]/g, '') // Remove box drawing characters
        .replace(/<hr[^>]*>/gi, '') // Remove horizontal rules
        .replace(/<hr[^>]*\/>/gi, '') // Remove self-closing horizontal rules
        .replace(/___+/g, '') // Remove underscore dividers
        .replace(/---+/g, '') // Remove dash dividers
        .replace(/\u2014+/g, '') // Remove em dashes used as dividers
        .replace(/\u2013+/g, '') // Remove en dashes used as dividers
        .replace(/\s*\|\s*/g, '') // Remove pipe separators
        .replace(/\s*•\s*/g, '') // Remove bullet separators
        // Remove divs that only contain divider-like content
        .replace(/<div[^>]*>[^a-zA-Z0-9<>]*<\/div>/gi, '')
        .replace(/<p[^>]*>[^a-zA-Z0-9<>]*<\/p>/gi, '') // Remove paragraphs with only symbols
        // Remove any remaining horizontal line patterns
        .replace(/[─━═]+/g, '') // Remove various horizontal line characters
        .replace(/_{3,}/g, '') // Remove 3+ underscores
        .replace(/-{3,}/g, '') // Remove 3+ dashes
        .replace(/={3,}/g, '') // Remove 3+ equals signs
        // Remove newsletter header patterns that might remain
        .replace(/^[^<]*?(Brave Enough|Newsletter|Letters on)/i, 'Brave Enough')
        // Clean up extra whitespace and line breaks
        .replace(/\s+/g, ' ')
        .replace(/^\s*<[^>]*>\s*/, '') // Remove leading empty tags
        .replace(/^[\s\n\r]*/, '') // Remove leading whitespace/newlines
        .replace(/^[^\w<]*/, '') // Remove leading non-word characters
        // If content starts with date patterns, remove them
        .replace(/^[^<]*?\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}[^<]*?(?=\w)/gi, '')
        .replace(/^[^a-zA-Z<]*/, '') // Remove any remaining leading non-letter characters
        .trim();
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
      publishedAt: (fullPost.published_at ? new Date(fullPost.published_at).getTime() : 
                   fullPost.created ? new Date(fullPost.created).getTime() : 
                   Date.now()).toString(),
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
      publishedTime: new Date(parseInt(post.publishedAt)).toISOString(),
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