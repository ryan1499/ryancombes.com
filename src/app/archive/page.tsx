'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type Post = {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  tags: string[];
  webUrl: string;
  slug: string;
  publishedAt: string;
  thumbnailUrl?: string;
};

export default function Archive() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      // Sort posts by publishedAt timestamp in descending order (newest first)
      const sortedPosts = (data.posts || []).sort((a: Post, b: Post) => 
        parseInt(b.publishedAt) - parseInt(a.publishedAt)
      );
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <p style={{color: '#5A5856'}}>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>

      {/* Archive Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-normal mb-4 text-brand-dark">
            Archive
          </h1>
          <p className="text-lg mb-6 text-brand-muted">
            {posts.length} letters on courage, freedom, and meaning
          </p>
          
          {/* Search Input */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-white transition-all focus:ring-2 focus:border-transparent"
              style={{borderColor: '#DFDFDF', color: '#1F1F1F'}}
              onFocus={(e) => e.target.style.borderColor = '#747C5DFF'}
              onBlur={(e) => e.target.style.borderColor = '#DFDFDF'}
            />
          </div>
          
          {searchQuery && (
            <p className="text-center text-sm mb-4" style={{color: '#5A5856'}}>
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          )}
        </motion.div>

        {/* Posts Grid */}
        <div className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300"
              style={{borderColor: '#DFDFDF'}}
            >
              <Link href={`/p/${post.slug}`} className="block">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  {post.thumbnailUrl && (
                    <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-3">
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
                    
                    <h2 className="text-xl md:text-2xl font-playfair font-semibold mb-3" style={{color: '#1F1F1F'}}>
                      {post.title}
                    </h2>
                    
                    {post.subtitle && (
                      <p className="text-base mb-4 font-normal leading-relaxed" style={{color: '#5A5856'}}>
                        {post.subtitle}
                      </p>
                    )}

                  </div>
                </div>
              </Link>
            </motion.article>
          ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{color: '#5A5856'}}>
                {searchQuery ? 'No posts found matching your search.' : 'No posts available.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 text-sm rounded-lg border transition-colors hover:bg-stone-50"
                  style={{borderColor: '#DFDFDF', color: '#5A5856'}}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}