'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

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

interface PostClientProps {
  post: Post;
}

export default function PostClient({ post }: PostClientProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Successfully subscribed! Check your email for confirmation.')
        setEmail('')
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setMessage('Failed to subscribe. Please try again.')
    }

    setIsLoading(false)
  }

  const formatDate = (timestamp: string) => {
    // Try different date formats
    let date: Date;
    
    // First try parsing as timestamp (milliseconds)
    if (!isNaN(Number(timestamp))) {
      const num = Number(timestamp);
      // If it's a small number, it might be seconds, so convert to milliseconds
      date = new Date(num > 10000000000 ? num : num * 1000);
    } else {
      // Try parsing as ISO string or other formats
      date = new Date(timestamp);
    }
    
    // Fallback to current date if parsing failed
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>
      <article className="max-w-4xl mx-auto px-6 py-8">

        {/* Article Header */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm" style={{color: '#5A5856'}}>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">→</span>
              <Link href="/archive" className="hover:underline">Letters</Link>
              <span className="mx-2">→</span>
              <span className="font-medium">{post.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-playfair font-normal mb-4 leading-tight" style={{color: '#1F1F1F'}}>
              {post.title}
            </h1>
            
            {post.subtitle && (
              <h2 className="text-lg md:text-xl mb-6 leading-relaxed font-normal" style={{color: '#5A5856'}}>
                {post.subtitle}
              </h2>
            )}
            
            <div className="flex items-center justify-between text-sm border-b pb-4 mb-4" style={{borderColor: '#DFDFDF', color: '#5A5856'}}>
              <div className="flex items-center space-x-4">
                <span>By Ryan Combes</span>
                <span>•</span>
                <time dateTime={(() => {
                  const num = Number(post.publishedAt);
                  if (!isNaN(num)) {
                    return new Date(num > 10000000000 ? num : num * 1000).toISOString();
                  }
                  const date = new Date(post.publishedAt);
                  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                })()}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
          style={{color: '#1F1F1F'}}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="article-content"
          />
        </motion.div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t" style={{borderColor: '#DFDFDF'}}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-lg mx-auto" style={{border: `1px solid #DFDFDF`}}>
              <h3 className="text-xl font-playfair font-semibold mb-2" style={{color: '#1F1F1F'}}>
                Enjoyed this letter?
              </h3>
              <p className="mb-4 text-sm" style={{color: '#5A5856'}}>
                Join others in exploring what it means to live brave enough.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-sm"
                  style={{borderColor: '#DFDFDF', focusRingColor: '#747C5DFF'}}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg text-white font-normal transition-colors text-sm disabled:opacity-50"
                  style={{backgroundColor: '#747C5DFF'}}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {message && (
                <div className="mt-3">
                  <p className="text-xs" style={{color: message.includes('Successfully') ? '#747C5DFF' : '#dc2626'}}>
                    {message}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </footer>
      </article>
    </div>
  );
}