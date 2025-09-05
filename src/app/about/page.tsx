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

          <div className="prose prose-lg max-w-none space-y-3" style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7'}}>
            <p>I grew up in fear.</p>

            <p>My childhood was shaped by paranoia. We moved endlessly to escape the inevitable apocalypse, always believing the end was just around the corner. Fear was the air I breathed.</p>

            <p>In my twenties, I thought I&apos;d escaped it. I went to college, built an online business, and traveled the world — free from the constraints of the system.</p>

            <p>But fear followed me.</p>

            <p>Not in stockpiled food or escape plans, but in subtler ways: in my relationships, in my obsession with achievement, in what I believed the world held for me.</p>

            <p>I thought freedom meant escape. What I&apos;ve learned is that real freedom requires courage — the courage to love, to commit, to live with meaning even when it feels risky.</p>

            <p>That&apos;s what I write about now.</p>

            <p>Each week I share letters on fear, freedom, and courage — not as a guru with all the answers, but as a fellow traveler still learning. My hope is simple: that my story helps you name your own, and find the courage to live more freely, too.</p>

            <p>If you&apos;ve felt this too, you&apos;re not alone — let&apos;s keep going together.</p>
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