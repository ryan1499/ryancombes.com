'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 hover:opacity-70 transition-opacity"
            style={{color: '#5A5856'}}
          >
            <ArrowLeft size={20} />
            <span>Back to Letters</span>
          </Link>
        </motion.div>

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
              <span>Letters</span>
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
            
            <div className="flex items-center justify-between text-sm border-b pb-4 mb-8" style={{borderColor: '#DFDFDF', color: '#5A5856'}}>
              <div className="flex items-center space-x-4">
                <span>By Ryan Combes</span>
                <span>•</span>
                <time dateTime={new Date(parseInt(post.publishedAt) * 1000).toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Subtle divider */}
        <div className="mt-8 mb-12 w-24 h-px mx-auto" style={{backgroundColor: '#DFDFDF'}}></div>

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
                Join thousands exploring what it means to live brave enough.
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 rounded-lg text-white font-normal transition-colors"
                style={{backgroundColor: '#747C5DFF'}}
              >
                Subscribe to Brave Enough
              </Link>
            </div>
          </motion.div>
        </footer>
      </article>
    </div>
  );
}