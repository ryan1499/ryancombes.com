'use client'

import { motion } from 'framer-motion'
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const socialLinks = [
  { href: 'https://x.com/ryan_combes', icon: Twitter, label: 'X' },
  { href: 'https://www.linkedin.com/in/ryan-combes-a895b347', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ryan_combes/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@RyanCombes99', icon: Youtube, label: 'YouTube' }
]

type Post = {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      // Show specific featured posts
      const featuredSlugs = ['living-in-truth', 'achievement-isnt-enough', 'living-past-fear'];
      const allPosts = data.posts || [];
      const featuredPosts = featuredSlugs.map(slug => 
        allPosts.find((post: Post) => post.slug === slug)
      ).filter(Boolean);
      
      setPosts(featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
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
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 px-6">
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
                alt="Ryan Combes - Author of Brave Enough Newsletter, Personal Development Coach"
                fill
                className="rounded-full object-cover shadow-lg"
                priority
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-playfair font-normal mb-4" style={{color: '#1F1F1F'}}>
              Hey — I&apos;m Ryan Combes
            </h1>
            
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal mb-4" style={{color: '#5A5856'}}>
              I write about fear, courage, and meaning.
            </p>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal" style={{color: '#5A5856'}}>
              Join me exploring what it means to live 
              <span className="font-semibold" style={{color: '#747C5DFF'}}> brave enough</span>.
            </p>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm max-w-lg mx-auto mb-8"
            style={{border: `1px solid #DFDFDF`}}
          >
            <h2 className="text-2xl font-playfair font-normal mb-4" style={{color: '#1F1F1F'}}>
              Brave Enough Newsletter
            </h2>
            <p className="mb-6 text-base font-normal" style={{color: '#5A5856'}}>
              Weekly insights on inner work, courage, and authentic living.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-5">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border bg-white transition-all focus:ring-2 focus:border-transparent text-base"
                style={{borderColor: '#DFDFDF', color: '#1F1F1F'}}
                onFocus={(e) => e.target.style.borderColor = '#747C5DFF'}
                onBlur={(e) => e.target.style.borderColor = '#DFDFDF'}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-normal py-3 px-6 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50 text-base"
                style={{backgroundColor: '#747C5DFF'}}
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
            className="flex justify-center space-x-6 mb-8"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white rounded-full shadow-sm transition-colors"
                style={{border: `1px solid #DFDFDF`, color: '#5A5856'}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#747C5DFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5A5856'}
              >
                <link.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl font-playfair font-normal text-center mb-8"
            style={{color: '#1F1F1F'}}
          >
            Featured Letters
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/p/${post.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{border: `1px solid #DFDFDF`}}
                >
                  {/* Thumbnail */}
                  {post.thumbnailUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3 text-sm" style={{color: '#5A5856'}}>
                      <span>{new Date(parseInt(post.publishedAt) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-playfair font-semibold mb-3 leading-tight" style={{color: '#1F1F1F'}}>
                      {post.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed" style={{color: '#5A5856'}}>
                      {post.subtitle}
                    </p>
                    
                    <div className="flex items-center mt-4 pt-4 border-t" style={{borderColor: '#DFDFDF'}}>
                      <div className="relative w-6 h-6 mr-2">
                        <Image
                          src="/profile.png"
                          alt="Ryan Combes - Personal Development Author"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium" style={{color: '#1F1F1F'}}>
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
              className="inline-block px-6 py-3 rounded-lg border transition-colors hover:bg-stone-50"
              style={{borderColor: '#DFDFDF', color: '#5A5856'}}
            >
              View all {posts.length > 3 ? posts.length : ''} posts →
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}