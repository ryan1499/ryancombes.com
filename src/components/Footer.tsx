'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

const socialLinks = [
  { href: 'https://x.com/ryan_combes', icon: Twitter, label: 'X' },
  { href: 'https://www.linkedin.com/in/ryan-combes-a895b347', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ryan_combes/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@RyanCombes99', icon: Youtube, label: 'YouTube' }
]

export default function Footer() {
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
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <footer className="border-t py-12 px-6" style={{backgroundColor: '#FAF8F2', borderColor: '#DFDFDF'}}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Brand Statement */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-playfair font-semibold mb-1" style={{color: '#1F1F1F'}}>
              Ryan Combes
            </h3>
            <p className="text-sm" style={{color: '#5A5856'}}>
              Intimate writing on fear, courage, and meaning.
            </p>
          </div>

          {/* Right Side - Email Signup and Social */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Email Signup */}
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="px-4 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                style={{borderColor: '#DFDFDF', focusRingColor: '#747C5DFF'}}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-l-0 rounded-r-lg hover:bg-stone-50 transition-colors"
                style={{borderColor: '#DFDFDF', color: '#5A5856'}}
              >
                <span className="text-lg">→</span>
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  style={{color: '#5A5856'}}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Success/Error Message */}
        {message && (
          <div className="text-center mt-4">
            <p className="text-sm" style={{color: message.includes('Successfully') ? '#747C5DFF' : '#dc2626'}}>
              {message}
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}