'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, use, useCallback } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'

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

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${resolvedParams.slug}`);
      const data = await response.json();
      
      if (response.ok) {
        setPost(data.post);
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FAF8F2'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#747C5DFF'}}></div>
          <p style={{color: '#5A5856'}}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FAF8F2'}}>
        <div className="text-center">
          <h1 className="text-2xl font-playfair mb-4" style={{color: '#1F1F1F'}}>
            {error || 'Post not found'}
          </h1>
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
            style={{borderColor: '#DFDFDF', color: '#5A5856'}}
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm" style={{color: '#5A5856'}}>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Home
          </Link>
          <span>›</span>
          <Link href="/archive" className="hover:opacity-80 transition-opacity">
            Posts
          </Link>
          <span>›</span>
          <span>{post.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <time 
                className="text-sm font-normal"
                style={{color: '#5A5856'}}
              >
                {formatDate(post.publishedAt)}
              </time>
              <span 
                className="text-sm"
                style={{color: '#5A5856'}}
              >
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-playfair font-normal mb-4 leading-tight" style={{color: '#1F1F1F'}}>
              {post.title}
            </h1>

            {post.subtitle && (
              <h2 className="text-xl md:text-2xl font-normal mb-6 leading-relaxed" style={{color: '#5A5856'}}>
                {post.subtitle}
              </h2>
            )}

            {/* Subtle divider */}
            <div className="mt-8 mb-12 w-24 h-px mx-auto" style={{backgroundColor: '#DFDFDF'}}></div>

          </header>

          {/* Article Content */}
          {post.content ? (
            <div 
              className="prose prose-xl max-w-none"
              style={{
                color: '#1F1F1F',
                lineHeight: '1.7',
                fontSize: '1.125rem'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-8" style={{color: '#5A5856'}}>
                This post was originally published on my newsletter. Click the link below to read the full article.
              </p>
              
              <div className="p-6 bg-white rounded-lg border text-center mb-8" style={{borderColor: '#DFDFDF'}}>
                <h3 className="text-xl font-playfair font-semibold mb-4" style={{color: '#1F1F1F'}}>
                  Read the full article
                </h3>
                <a 
                  href={post.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-lg text-white font-normal transition-colors"
                  style={{backgroundColor: '#747C5DFF'}}
                >
                  Continue reading on Beehiiv →
                </a>
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 p-8 bg-white rounded-lg border text-center"
            style={{borderColor: '#DFDFDF'}}
          >
            <Mail size={32} className="mx-auto mb-4" style={{color: '#747C5DFF'}} />
            <h3 className="text-xl font-playfair font-semibold mb-2" style={{color: '#1F1F1F'}}>
              Enjoyed this letter?
            </h3>
            <p className="mb-6" style={{color: '#5A5856'}}>
              Join me on my journey of exploring fear, courage, and meaning.
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 rounded-lg text-white font-normal transition-colors"
              style={{backgroundColor: '#747C5DFF'}}
            >
              Subscribe to Brave Enough
            </Link>
          </motion.div>
        </motion.div>
      </article>
    </div>
  );
}