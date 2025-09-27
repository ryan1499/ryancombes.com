'use client'

import { motion } from 'framer-motion'
import { X, Linkedin, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const socialLinks = [
  { href: 'https://x.com/ryan_combes', icon: X, label: 'X' },
  { href: 'https://www.linkedin.com/in/ryan-combes-a895b347', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ryan_combes/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@RyanCombes99', icon: Youtube, label: 'YouTube' }
]

type Post = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  webUrl: string;
  publishedAt: string;
  thumbnailUrl?: string;
  slug: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      // Show specific featured posts
      const featuredSlugs = ['the-price-of-being-right', 'achievement-isnt-enough', 'living-past-fear'];
      const allPosts = data.posts || [];
      const featuredPosts = featuredSlugs.map(slug => 
        allPosts.find((post: Post) => post.slug === slug)
      ).filter(Boolean);
      
      setPosts(featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setMessage('Failed to subscribe. Please try again.');
    }

    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Minimal corner navigation */}
      <nav className="absolute top-6 right-6 z-10 flex items-center space-x-4 text-sm">
        <Link 
          href="/archive"
          className="hover:opacity-70 transition-opacity text-brand-muted"
        >
          Archive
        </Link>
        <span className="text-brand-border opacity-40">•</span>
        <Link 
          href="/about"
          className="hover:opacity-70 transition-opacity text-brand-muted"
        >
          About
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 md:pt-16 pb-0 px-6" role="banner">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src="/profile.png"
                alt="Ryan Combes - Author of Brave Enough Newsletter, Personal Growth Writer"
                fill
                sizes="96px"
                className="rounded-full object-cover shadow-lg"
                priority
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-playfair font-normal mb-6 text-brand-dark">
              Hey — I&apos;m Ryan Combes
            </h1>
            
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-6 text-brand-muted">
	I grew up in fear, waiting for the world to fall apart. 
            </p>
	    <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal text-brand-muted">
Now I write about the courage to stop surviving and start living.
</p>
            
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal text-brand-muted">
Join me below to face fear together and find the courage that expands life.
</p>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm max-w-lg mx-auto mb-6 border border-brand"
          >
            <h2 className="text-2xl font-playfair font-normal mb-4 text-brand-dark">
              Brave Enough Newsletter
            </h2>
            <p className="mb-6 text-base font-normal text-brand-muted">
            Weekly letters with honest stories and questions on building the courage we need most.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-5">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-brand bg-white transition-all focus:ring-2 focus:border-transparent text-base text-brand-dark focus:border-brand-accent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-normal py-4 px-6 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 text-base bg-brand-accent"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
              {message && (
                <p className={`text-base text-center ${message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-6 mb-6"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white rounded-full shadow-sm transition-colors border border-brand text-brand-muted hover:text-brand-accent"
              >
                <link.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Divider */}
      <div className="flex justify-center mt-2 mb-8">
        <div className="w-32 h-0.5" style={{backgroundColor: '#DFDFDF'}}></div>
      </div>

      {/* Featured Posts */}
      <main className="pb-6 px-6" role="main">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl font-playfair font-normal text-center mb-8 text-brand-dark"
          >
            Featured Letters
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {postsLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-brand">
                  <div className="relative w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="flex items-center mt-4 pt-4 border-t border-brand">
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : posts.map((post, index) => (
              <Link key={post.id} href={`/p/${post.slug}`} prefetch={true}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-brand"
                >
                  {/* Thumbnail */}
                  {post.thumbnailUrl && (
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSd1E2VEiCQQKBgkNpOqt2urFd+Uo1b/2Q=="
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3 text-sm text-brand-muted">
                      <span>{new Date(parseInt(post.publishedAt) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <h3 className="text-xl font-playfair font-semibold mb-3 leading-tight text-brand-dark">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed text-brand-muted">
                      {post.subtitle}
                    </p>
                    
                    <div className="flex items-center mt-4 pt-4 border-t border-brand">
                      <div className="relative w-6 h-6 mr-2">
                        <Image
                          src="/profile.png"
                          alt="Ryan Combes - Personal Growth Writer"
                          fill
                          sizes="24px"
                          className="rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-sm font-medium text-brand-dark">
                        Ryan Combes
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
          
          {/* View All Posts Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-12"
          >
            <Link 
              href="/archive"
              className="inline-block px-6 py-3 rounded-lg border border-brand transition-colors hover:bg-stone-50 text-brand-muted"
            >
              View all {posts.length > 3 ? posts.length : ''} letters →
            </Link>
          </motion.div>
        </div>
      </main>

    </div>
  )
}