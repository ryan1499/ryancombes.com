'use client'

import { motion } from 'framer-motion'
import { X, Linkedin, Instagram, Youtube } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
  { href: 'https://x.com/ryan_combes', icon: X, label: 'X' },
  { href: 'https://www.linkedin.com/in/ryan-combes-a895b347', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ryan_combes/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@RyanCombes99', icon: Youtube, label: 'YouTube' }
]

export default function About() {
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

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAF8F2'}}>

      {/* About Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-normal mb-8 leading-tight" style={{color: '#1F1F1F'}}>
            About Me
          </h1>

          <div className="prose prose-lg max-w-none">
            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                I grew up on the Big Island of Hawaiʻi in a survivalist home. Prepping, fear, and worst-case scenarios were the air I breathed as a kid. That shaped me in deep ways — I learned resilience, but I also carried a lot of fear.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                As I got older, I realized survival wasn&apos;t enough. I wanted to live with courage, not just stay safe. Writing became the way I worked that out — turning fear into words, questions into meaning.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                That&apos;s why I started Brave Enough. It&apos;s my weekly letter about fear, courage, and finding freedom from the scripts we inherit. I don&apos;t write as someone with all the answers. I write because I&apos;m wrestling too — and I&apos;ve found that sharing the questions helps us all feel a little less alone.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                If you&apos;ve ever felt the pull between safety and truth, between the life expected of you and the one you actually want — you&apos;ll feel at home here.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                I&apos;d love for you to join me — one letter at a time, as we learn to be brave enough.
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 p-8 bg-white rounded-lg border text-center"
            style={{borderColor: '#DFDFDF'}}
          >
            <h3 className="text-xl font-playfair font-semibold mb-2" style={{color: '#1F1F1F'}}>
              Join the journey
            </h3>
            <p className="mb-6" style={{color: '#5A5856'}}>
              Weekly letters on fear, courage, and meaning delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-sm"
                style={{borderColor: '#DFDFDF'}}
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
          </motion.div>

          {/* Social Links */}
          <div className="mt-8 flex justify-center space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                style={{border: `1px solid #DFDFDF`, color: '#5A5856'}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#747C5DFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5A5856'}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}