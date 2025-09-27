#!/usr/bin/env node

/**
 * Weekly Content Backup Script
 * Fetches all posts from Beehiiv API and saves as markdown files
 * Replaces previous backup on each run
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'content-backup');
const API_BASE = 'https://api.beehiiv.com/v2';

class ContentBackup {
  constructor() {
    this.apiKey = process.env.BEEHIIV_API_KEY;
    this.publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    
    if (!this.apiKey || !this.publicationId) {
      throw new Error('Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID environment variables');
    }
  }

  async fetchAllPosts() {
    console.log('📡 Fetching all posts from Beehiiv API...');
    
    const response = await fetch(
      `${API_BASE}/publications/${this.publicationId}/posts?status=confirmed&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Beehiiv API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  async fetchPostContent(postId) {
    const response = await fetch(
      `${API_BASE}/publications/${this.publicationId}/posts/${postId}?expand=free_web_content`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`⚠️  Failed to fetch content for post ${postId}`);
      return null;
    }

    const data = await response.json();
    return data.data;
  }

  cleanContent(rawHtml) {
    if (!rawHtml) return '';
    
    // Basic HTML to markdown-like conversion
    return rawHtml
      .replace(/<script[^>]*>.*?<\/script>/gs, '')
      .replace(/<style[^>]*>.*?<\/style>/gs, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  formatDate(timestamp) {
    if (!timestamp) return new Date().toISOString();
    const date = new Date(timestamp * 1000);
    return date.toISOString();
  }

  createMarkdownContent(post, fullContent) {
    const cleanContent = this.cleanContent(
      fullContent?.content?.free?.web || 
      fullContent?.free_web_content || 
      fullContent?.content_html || 
      post.excerpt || 
      ''
    );

    return `---
title: "${post.title || 'Untitled'}"
subtitle: "${post.subtitle || ''}"
slug: "${post.slug}"
publishedAt: "${this.formatDate(post.publish_date)}"
thumbnailUrl: "${post.thumbnail_url || ''}"
webUrl: "${post.web_url || ''}"
tags: ${JSON.stringify(post.content_tags || [])}
backup_date: "${new Date().toISOString()}"
beehiiv_id: "${post.id}"
---

# ${post.title || 'Untitled'}

${post.subtitle ? `*${post.subtitle}*\n\n` : ''}

${cleanContent}

---

**Original URL:** ${post.web_url || 'N/A'}
**Backup Date:** ${new Date().toLocaleDateString()}
**Beehiiv ID:** ${post.id}
`;
  }

  async clearBackupDirectory() {
    try {
      await fs.rm(BACKUP_DIR, { recursive: true, force: true });
      console.log('🗑️  Cleared previous backup');
    } catch (error) {
      // Directory might not exist, that's fine
    }
    
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }

  async saveMetadata(posts) {
    const metadata = {
      backup_date: new Date().toISOString(),
      total_posts: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: this.formatDate(post.publish_date),
        webUrl: post.web_url
      }))
    };

    await fs.writeFile(
      path.join(BACKUP_DIR, 'backup-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }

  async run() {
    try {
      console.log('🚀 Starting weekly content backup...');
      
      // Clear previous backup
      await this.clearBackupDirectory();
      
      // Fetch all posts
      const posts = await this.fetchAllPosts();
      console.log(`📄 Found ${posts.length} posts to backup`);
      
      if (posts.length === 0) {
        console.log('⚠️  No posts found to backup');
        return;
      }

      // Backup each post
      let successCount = 0;
      for (const post of posts) {
        try {
          console.log(`📝 Backing up: ${post.title || post.slug}`);
          
          // Fetch full content
          const fullContent = await this.fetchPostContent(post.id);
          
          // Create markdown file
          const markdown = this.createMarkdownContent(post, fullContent);
          const filename = `${post.slug || post.id}.md`;
          
          await fs.writeFile(
            path.join(BACKUP_DIR, filename),
            markdown
          );
          
          successCount++;
          
          // Rate limiting - be nice to Beehiiv API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Failed to backup post ${post.slug}: ${error.message}`);
        }
      }
      
      // Save metadata
      await this.saveMetadata(posts);
      
      // Create README
      const readme = `# Content Backup

This directory contains a weekly backup of all posts from the Beehiiv API.

**Backup Date:** ${new Date().toLocaleDateString()}
**Total Posts:** ${successCount}
**Last Updated:** ${new Date().toISOString()}

## Files

- \`backup-metadata.json\` - Backup metadata and post index
- \`*.md\` - Individual post files in Markdown format

## Usage

These files serve as a backup in case the Beehiiv API becomes unavailable.
Each markdown file contains the full post content and metadata.

## Restore Process

If needed, these files can be imported into any markdown-based CMS or 
converted back to your site's format using the metadata in each file.
`;

      await fs.writeFile(path.join(BACKUP_DIR, 'README.md'), readme);
      
      console.log(`✅ Backup completed successfully!`);
      console.log(`📁 Location: ${BACKUP_DIR}`);
      console.log(`📊 Backed up ${successCount}/${posts.length} posts`);
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the backup
if (require.main === module) {
  const backup = new ContentBackup();
  backup.run();
}

module.exports = ContentBackup;