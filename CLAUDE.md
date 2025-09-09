# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables Required
- `BEEHIIV_API_KEY` - API key for Beehiiv newsletter service
- `BEEHIIV_PUBLICATION_ID` - Publication ID for the newsletter

## Architecture Overview

This is a Next.js 15 personal website and newsletter platform for Ryan Combes, built with the App Router architecture. The site integrates with Beehiiv for newsletter management and content delivery.

### Key Technologies
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Beehiiv API** integration for newsletter and blog posts
- **next-themes** for theme management

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `page.tsx` - Homepage with newsletter signup and featured posts
  - `about/page.tsx` - About page
  - `archive/page.tsx` - All posts archive
  - `p/[slug]/` - Dynamic blog post pages
  - `api/` - API routes for Beehiiv integration
- `src/components/` - Reusable React components
- Root layout uses custom fonts: Playfair Display (headings) and Karla (body)

### Design System
- **Colors**: Cream background (#FAF8F2), dark text (#1F1F1F), muted text (#5A5856), accent green (#747C5DFF)
- **Typography**: Playfair Display for headings, Karla for body text
- **Components**: Consistent styling with rounded corners, subtle shadows, and hover animations

### API Integration
- `/api/posts` - Fetches published posts from Beehiiv API with filtering for scheduled posts
- `/api/posts/[slug]` - Individual post content by slug
- `/api/subscribe` - Newsletter subscription endpoint
- Posts include automatic read time estimation and HTML content processing

### Content Management
- Blog posts are managed through Beehiiv CMS
- Featured posts are hard-coded slugs: 'living-in-truth', 'achievement-isnt-enough', 'living-past-fear'
- Posts support thumbnails, tags, and rich HTML content from Beehiiv

### Styling Approach
- Uses Tailwind CSS with custom color variables
- Consistent spacing and typography scale
- Responsive design with mobile-first approach
- Framer Motion for smooth page transitions and hover animations

## Performance Optimizations

### Font Loading
- Google Fonts (Playfair Display, Karla) configured with `preload: true`, `display: swap`, and fallbacks
- Resource hints added for fonts.googleapis.com and fonts.gstatic.com

### Image Optimization
- Next.js Image component used throughout with proper sizing attributes
- Lazy loading for below-the-fold images
- Modern formats (WebP/AVIF) enabled in next.config.ts
- Blur placeholders for better perceived performance

### JavaScript Bundle
- Package imports optimized for lucide-react and framer-motion
- Console logging removed in production builds
- API caching configured with 5-minute revalidation

### Content Processing
- Uses cheerio for HTML parsing instead of aggressive regex replacements
- Consistent content processing between API routes and server-side rendering
- Preserves article content while removing Beehiiv wrapper elements

## Troubleshooting

### Content Truncation Issues
- If Beehiiv content appears cut off, check the content processing logic in `src/app/p/[slug]/page.tsx`
- Ensure cheerio-based parsing is maintained over regex replacements
- Content processing should preserve legitimate text while removing only styling/wrapper elements

### Performance Issues
- Run Lighthouse audits to identify bottlenecks
- Check that image optimization settings are properly configured
- Verify font preloading and resource hints are working
- Monitor bundle sizes in build output