'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white" style={{borderColor: '#DFDFDF'}}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10">
              <Image
                src="/profile.png"
                alt="Ryan Combes"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-playfair font-semibold" style={{color: '#1F1F1F'}}>
                Ryan Combes
              </h1>
              <p className="text-sm" style={{color: '#5A5856'}}>
                Brave Enough Newsletter
              </p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/archive"
              className={`text-sm hover:opacity-80 transition-opacity ${
                pathname === '/archive' ? 'font-medium' : ''
              }`}
              style={{color: pathname === '/archive' ? '#747C5DFF' : '#5A5856'}}
            >
              Archive
            </Link>
            <Link 
              href="/about"
              className={`text-sm hover:opacity-80 transition-opacity ${
                pathname === '/about' ? 'font-medium' : ''
              }`}
              style={{color: pathname === '/about' ? '#747C5DFF' : '#5A5856'}}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}