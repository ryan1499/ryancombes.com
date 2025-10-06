# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack (includes automatic lint check)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run backup` - Run content backup manually (creates GPT-optimized archive)

### Environment Variables Required
- `BEEHIIV_API_KEY` - API key for Beehiiv newsletter service
- `BEEHIIV_PUBLICATION_ID` - Publication ID for the newsletter
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (G-5J0XCXZDNR)

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
    - `posts/route.ts` - Fast homepage endpoint (3 featured posts)
    - `posts/all/route.ts` - Full archive endpoint (all posts)
    - `posts/[slug]/route.ts` - Individual post endpoint
  - `sitemap.ts` - Dynamic sitemap generation (uses `/api/posts/all`)
- `src/components/` - Reusable React components
- `src/lib/` - Shared utility functions
  - `utils.ts` - Read time estimation and other helpers
- `scripts/` - Utility scripts (ignored by ESLint for CommonJS compatibility)
  - `backup-content.js` - Weekly content backup with GPT optimization
- `.github/workflows/` - GitHub Actions for automation
  - `weekly-backup.yml` - Automated Sunday backups
- `content-backup/` - Weekly backup output (gitignored locally, committed by CI)
- Root layout uses custom fonts: Playfair Display (headings) and Karla (body)

### Design System
- **Colors**: Cream background (#FAF8F2), dark text (#1F1F1F), muted text (#5A5856), accent green (#747C5DFF)
- **Typography**: Playfair Display for headings, Karla for body text
- **Components**: Consistent styling with rounded corners, subtle shadows, and hover animations

### API Integration
- `/api/posts` - Fast homepage endpoint returning 3 featured posts (optimized for performance)
- `/api/posts/all` - Full archive endpoint returning all published posts with pagination
- `/api/posts/[slug]` - Individual post content by slug with full HTML processing
- `/api/subscribe` - Newsletter subscription endpoint
- Posts include automatic read time estimation and HTML content processing
- API responses optimized: homepage ~9KB vs previous 2.8MB payload

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
- API caching configured with optimized revalidation intervals:
  - Homepage posts: 15 minutes (900s)
  - Archive posts: 1 hour (3600s)
  - Individual posts: 1-2 hours (3600-7200s)

### Content Processing
- Uses cheerio for HTML parsing instead of aggressive regex replacements
- Consistent content processing between API routes and server-side rendering
- Preserves article content while removing Beehiiv wrapper elements

### API Performance Optimizations (December 2024)
- **Individual Post Pages**: Optimized load times by 75-85% (from 4-6 seconds to ~1 second)
- **Homepage API**: Reduced response size by 99.7% (from 2.8MB to ~9KB)
- **Endpoint Separation**: Created dedicated fast/slow endpoints based on use case
- **Eliminated Double API Calls**: Individual posts now use optimized `/api/posts/[slug]` endpoint
- **Featured Posts Logic**: Homepage guarantees all 3 featured posts display correctly
- **Error Handling**: Added graceful fallbacks for broken image thumbnails
- **Cache Optimization**: Different caching strategies per endpoint based on content freshness needs

## SEO & Technical Optimizations

### SEO Features Implemented
- **Structured Data (JSON-LD)**: Person, Website, Blog, and Article schemas for enhanced search visibility
- **Keyword Optimization**: Strategic keyword distribution in titles, headings, and meta descriptions
- **Page-Specific Metadata**: Dedicated metadata for all routes with targeted descriptions
- **Semantic HTML**: Proper heading hierarchy (H1→H2→H3) and semantic elements
- **Image Optimization**: AVIF/WebP formats prioritized with proper caching headers
- **No Inline CSS**: All styling uses Tailwind utility classes and CSS custom properties
- **Dynamic Sitemap**: Automatically includes all 60+ articles via `/api/posts/all` endpoint
- **Comprehensive Indexing**: Fixed critical issue where only 3 posts were discoverable (now all 60+)

### Brand Color System
- CSS custom properties defined in globals.css for consistent theming
- Brand utility classes: `.bg-brand-cream`, `.bg-brand-accent`, `.text-brand-dark`, etc.
- Color variables: `--color-cream`, `--color-dark-text`, `--color-muted`, `--color-accent`, `--color-border`

### Content Guidelines
- Ryan Combes is referred to as a "Writer & Storyteller" or "Personal Growth Writer"
- Brand focus: fear, courage, identity, meaning, spiritual depth, authentic freedom
- Target audience: ambitious young adults seeking personal growth beyond achievement

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
- **API Performance**: Individual posts should load in ~1 second, homepage API in ~200-400ms
- **Large Responses**: Archive page may take longer due to full post list - this is expected
- **Thumbnail Errors**: Broken images automatically hide with gray background fallback

### SEO Validation
- Use Google's Rich Results Test to verify structured data
- Check meta descriptions are under 160 characters
- Verify canonical URLs are properly set
- Test image optimization with WebP/AVIF serving

### Code Quality & Deployment
- **Automatic Linting**: Build process includes prebuild lint check to prevent deployment failures
- **ESLint Rules**: Enforces React/Next.js best practices including escaped entities
- **Common Fixes**: Use `npm run lint:fix` for automatic corrections
- **Deployment Prevention**: Lint errors will block Vercel deployments via prebuild script
- **ESLint Configuration**: Scripts directory ignored for CommonJS compatibility (`scripts/**` in ignores)
- **Code Standards**: Prefer ES modules and TypeScript-compatible syntax when possible

## Content Backup & ChatGPT Integration

### Weekly Automated Backup System
- **Schedule**: Every Sunday at 2 AM UTC via GitHub Actions
- **Output**: Creates both markdown files and GPT-optimized archive
- **Location**: `content-backup/` directory (committed to repository)
- **GPT Format**: Single `gpt-optimized-archive.txt` file ready for ChatGPT Custom GPT upload

### Backup Files Generated
- **Individual Markdown Files**: `[slug].md` - Human-readable backup files
- **GPT Archive**: `gpt-optimized-archive.txt` - ChatGPT Custom GPT ready format (281KB)
- **Metadata**: `backup-metadata.json` - Post index and backup information
- **Documentation**: `README.md` - Usage instructions for backup recovery

### ChatGPT Integration
- **Custom GPT Upload**: Use `gpt-optimized-archive.txt` in ChatGPT knowledge base
- **Format**: Structured with clear article boundaries, metadata, and context
- **Content**: All 60+ articles with proper formatting for GPT understanding
- **Update Process**: Replace file weekly for fresh content

### Manual Backup
- **Command**: `npm run backup` - Run backup locally for testing
- **Use Case**: Immediate backup or testing changes to backup script
- **Output**: Same format as automated system

### Future Automation Options
- **OpenAI API Integration**: When Custom GPT API becomes available
- **Real-time Updates**: Consider webhook-based updates for new posts
- **Multiple Formats**: Additional export formats as needed

## Development Standards & Best Practices

### ESLint Compatibility Requirements
- **Primary Rule**: Always use ES modules (`import/export`) instead of CommonJS (`require/module.exports`)
- **TypeScript Compatibility**: Write TypeScript-compatible code even in `.js` files
- **Exception**: Scripts in `scripts/` directory can use CommonJS (ignored by ESLint)
- **Testing**: Run `npm run lint` before commits to catch issues early

### Code Style Guidelines
- **Imports**: Use `import { thing } from 'module'` instead of `const thing = require('module')`
- **Exports**: Use `export default` or `export { }` instead of `module.exports`
- **Variables**: Prefer `const` and `let` over `var`
- **Functions**: Use arrow functions or function declarations consistently
- **Type Safety**: Add TypeScript types where beneficial

### Deployment Prevention
- **Lint Errors**: Will block Vercel deployments completely
- **Build Process**: Includes automatic linting via `prebuild` script
- **Fix Strategy**: Use `npm run lint:fix` for automatic corrections
- **Manual Review**: Check complex linting errors manually

### Architecture Decisions
- **API Endpoints**: Use `/api/posts/all` for complete data, `/api/posts` for featured content
- **Sitemap Generation**: Always use `/api/posts/all` to include all articles
- **Caching**: Different strategies per endpoint (15min homepage, 1-2hr individual posts)
- **Content Processing**: Use cheerio for HTML parsing, avoid aggressive regex replacements

### Recent Critical Fixes
- **Sitemap SEO**: Fixed to include all 60+ articles instead of just 3 featured posts
- **ESLint Configuration**: Added `scripts/**` to ignores for backup system compatibility
- **Content Backup**: Implemented comprehensive backup with ChatGPT optimization
- **Performance**: Optimized API responses from 2.8MB to ~9KB for homepage
- **Duplicate Definitions**: Consolidated shared constants and types to eliminate sync issues
- **Header Formatting**: Fixed CSS that was flattening header hierarchy in post content  
- **Development URLs**: Fixed localhost port conflicts in post page API calls
- **Mobile Spacing**: Fixed uneven dot spacing in post metadata on mobile devices