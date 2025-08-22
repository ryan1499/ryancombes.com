'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { X, Linkedin, Instagram, Youtube } from 'lucide-react'

const socialLinks = [
  { href: 'https://x.com/ryan_combes', icon: X, label: 'X' },
  { href: 'https://www.linkedin.com/in/ryan-combes-a895b347', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ryan_combes/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@RyanCombes99', icon: Youtube, label: 'YouTube' }
]

export default function About() {
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
                I grew up on the Big Island of Hawaiʻi and now live in New York with my wife. I write letters to make sense of my experiences — sometimes from clarity, more often from questions.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                My newsletter, <strong>Brave Enough</strong>, is a public journal where I explore fear, courage, and meaning.<br/>
                Each week, I share letters on the journey from survivalist chaos to self-authored freedom, searching for universal truths in unique experiences so that we all might grow a little more whole, together.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                When I&apos;m not writing, I work in growth marketing, helping companies connect with their audiences in meaningful ways.
              </p>
            </div>

            <div style={{marginBottom: '48px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                <em>How many times have I chosen harmony over honesty?<br/>
                And what would it cost to never choose it again?</em>
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                This question drives much of my writing — the tension between safety and truth, between fitting in and standing out, between the life we&apos;re expected to live and the one we&apos;re called to create.
              </p>
            </div>

            <div style={{marginBottom: '24px'}}>
              <p style={{color: '#1F1F1F', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '0'}}>
                If you&apos;re interested in exploring these themes of philosophy, mindfulness, and spirituality together, I&apos;d love to have you join me on this journey.
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
            <Link 
              href="/"
              className="inline-block px-6 py-3 rounded-lg text-white font-normal transition-colors"
              style={{backgroundColor: '#747C5DFF'}}
            >
              Subscribe to Brave Enough
            </Link>
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