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
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.post;
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