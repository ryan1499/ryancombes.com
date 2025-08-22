import { MetadataRoute } from 'next'

type Post = {
  slug: string;
  publishedAt: string;
};

async function getPosts(): Promise<Post[]> {
  try {
    // In production, use the production URL, in development return empty array to avoid fetch issues
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    
    const baseUrl = 'https://ryancombes.com';
    
    const response = await fetch(`${baseUrl}/api/posts`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  
  const postUrls = posts.map((post) => ({
    url: `https://ryancombes.com/p/${post.slug}`,
    lastModified: new Date(parseInt(post.publishedAt) * 1000),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://ryancombes.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://ryancombes.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://ryancombes.com/archive',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postUrls,
  ];
}