# Content Backup System

This document explains the weekly backup system for Beehiiv content.

## Overview

The backup system automatically fetches all posts from the Beehiiv API every Sunday and saves them as markdown files in the `content-backup/` directory. This provides protection against potential Beehiiv service disruption while maintaining your current API-based workflow.

## Components

### 1. Backup Script (`scripts/backup-content.js`)
- Fetches all posts from Beehiiv API
- Converts content to markdown format with frontmatter
- Clears previous backup and creates fresh copy
- Includes metadata and recovery information

### 2. GitHub Action (`.github/workflows/weekly-backup.yml`)
- Runs every Sunday at 2 AM UTC
- Can be triggered manually for testing
- Commits backup to repository
- Provides summary in GitHub Actions

### 3. Package Script
- `npm run backup` - Run backup manually for testing

## Setup Instructions

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `BEEHIIV_API_KEY` - Your Beehiiv API key
   - `BEEHIIV_PUBLICATION_ID` - Your publication ID

### 2. Testing the Backup

```bash
# Test locally (requires .env with API credentials)
npm run backup

# Test GitHub Action manually
# Go to Actions tab > Weekly Content Backup > Run workflow
```

### 3. Verify Setup

After running, check:
- `content-backup/` directory exists
- Contains `.md` files for each post
- `backup-metadata.json` has correct post count
- `README.md` explains the backup

## Backup Structure

```
content-backup/
├── README.md                    # Backup documentation
├── backup-metadata.json         # Index of all posts
├── the-price-of-being-right.md  # Individual post files
├── achievement-isnt-enough.md
└── ...                          # More post files
```

## Markdown File Format

Each backup file includes:

```markdown
---
title: "Post Title"
subtitle: "Post Subtitle"
slug: "post-slug"
publishedAt: "2025-09-13T13:00:00.000Z"
thumbnailUrl: "https://..."
webUrl: "https://ryancombes.com/p/post-slug"
tags: ["tag1", "tag2"]
backup_date: "2025-09-27T17:20:05.142Z"
beehiiv_id: "post_abc123"
---

# Post Title

*Post Subtitle*

Post content here...

---

**Original URL:** https://ryancombes.com/p/post-slug
**Backup Date:** 9/27/2025
**Beehiiv ID:** post_abc123
```

## Recovery Process

If Beehiiv becomes unavailable:

### Option 1: Quick Fallback System
1. Modify `src/app/p/[slug]/page.tsx` to read from backup files
2. Add fallback logic in API routes
3. Deploy updated site

### Option 2: Migration to New Platform
1. Use backup files to migrate to Ghost, Sanity, etc.
2. Import using each platform's import tools
3. Update site to use new API/CMS

### Option 3: Static Site Generation
1. Convert backup files to Next.js static pages
2. Update routing to serve static content
3. Remove API dependencies

## Maintenance

### Schedule
- **Automatic**: Every Sunday at 2 AM UTC
- **Manual**: Run `npm run backup` anytime
- **Monitoring**: Check GitHub Actions for success/failure

### Monitoring
- GitHub Actions will email on failures
- Check Actions tab for backup status
- Verify backup file count matches expected posts

### Storage
- Backups are stored in Git repository
- Previous backup is replaced each week
- Consider external storage for long-term archival

## Security

- Backup files contain full content (not sensitive)
- API keys stored as GitHub secrets
- Backup directory is gitignored locally but committed in CI
- No sensitive data exposed in backups

## Troubleshooting

### Common Issues

**"Missing API credentials" error:**
- Check GitHub secrets are set correctly
- Verify secret names match exactly

**No posts backed up:**
- Check API key permissions
- Verify publication ID is correct
- Check Beehiiv API status

**Backup directory not created:**
- Check file permissions
- Verify script runs successfully
- Check for JavaScript errors in logs

### Manual Backup

If automation fails, you can always run:
```bash
BEEHIIV_API_KEY=your_key BEEHIIV_PUBLICATION_ID=your_id npm run backup
```

## Cost and Performance

- **Storage**: ~1MB per week (60 posts × ~14KB average)
- **Runtime**: ~30 seconds for 60 posts
- **API calls**: 61 calls per backup (1 list + 60 individual posts)
- **Rate limiting**: 500ms delay between requests (respectful to Beehiiv)

## Next Steps

Consider these enhancements:

1. **External Storage**: Backup to S3/Dropbox for redundancy
2. **Content Diff**: Only backup changed posts
3. **Subscriber Backup**: Include subscriber list if API allows
4. **Monitoring**: Add alerting for backup failures
5. **Automated Recovery**: Build fallback reading system