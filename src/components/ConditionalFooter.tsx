'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on the About page
  if (pathname === '/about') {
    return null
  }
  
  return <Footer />
}