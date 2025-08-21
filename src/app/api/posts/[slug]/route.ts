import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      return NextResponse.json(
        { error: 'Missing Beehiiv API credentials' },
        { status: 500 }
      );
    }

    // First, get all posts to find the one with the matching slug
    const postsResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts?status=confirmed&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      console.error('Beehiiv API Error:', postsResponse.status, errorText);
      throw new Error(`Beehiiv API error: ${postsResponse.status}`);
    }

    const postsData = await postsResponse.json();
    const post = postsData.data?.find((p: any) => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get the full post content with HTML
    const postResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${post.id}?expand=free_web_content`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error('Beehiiv API Error:', postResponse.status, errorText);
      throw new Error(`Beehiiv API error: ${postResponse.status}`);
    }

    const fullPostData = await postResponse.json();
    const fullPost = fullPostData.data;

    // Extract and clean the HTML content from the expanded response
    let rawHtml = fullPost.content?.free?.web || 
                  fullPost.free_web_content || 
                  fullPost.content_html || 
                  '';

    // Parse and extract just the article content, removing Beehiiv's page structure
    let cleanedContent = '';
    if (rawHtml) {
      const $ = cheerio.load(rawHtml);
      
      // Remove all unwanted elements
      $('script, style, link, meta, nav, footer, header').remove();
      
      // Remove Beehiiv specific elements
      $('#web-header, .web-header, [class*="header"], [id*="header"]').remove();
      $('.navbar, .nav-bar, [class*="nav"]').remove();
      $('.footer, [class*="footer"]').remove();
      
      // Remove any title/subtitle elements that match the post data
      $('h1, h2, h3').each((i, el) => {
        const text = $(el).text().trim();
        if (text === fullPost.title || text === fullPost.subtitle) {
          $(el).remove();
        }
      });
      
      // Remove any duplicate title containers
      $('[class*="title"], [class*="headline"]').each((i, el) => {
        const text = $(el).text().trim();
        if (text === fullPost.title || text === fullPost.subtitle) {
          $(el).remove();
        }
      });
      
      // Look for the main content area
      let articleContent = '';
      
      // Try multiple selectors for content
      const contentSelectors = [
        '#content-blocks',
        '.content-blocks', 
        '.article-content',
        '.post-content',
        '.rendered-post .content',
        '.email-content',
        '[class*="content"]'
      ];
      
      for (const selector of contentSelectors) {
        const content = $(selector).html();
        if (content && content.trim().length > 100) {
          articleContent = content;
          break;
        }
      }
      
      // If no specific content area found, clean the body
      if (!articleContent) {
        // Remove Beehiiv wrapper elements
        $('.rendered-post, .email-wrapper, [class*="wrapper"]').each((i, el) => {
          const $el = $(el);
          // Unwrap the content but keep the inner HTML
          $el.replaceWith($el.html());
        });
        
        articleContent = $('body').html();
      }
      
      // Final cleanup pass - preserve Beehiiv's div structure
      if (articleContent) {
        const $clean = cheerio.load(articleContent);
        
        // Clean up Beehiiv styling but preserve structure
        $clean('div').each((i, el) => {
          const $div = $clean(el);
          // Remove all style attributes but keep the div structure
          $div.removeAttr('style class');
          
          // Clean up paragraphs within divs
          $div.find('p').each((j, p) => {
            const $p = $clean(p);
            $p.removeAttr('style class');
          });
        });
        
        // Remove scripts, but keep the div/p structure intact
        $clean('script, style, link, meta').remove();
        
        // Don't remove empty divs - they provide spacing in Beehiiv
        cleanedContent = $clean.html();
      }
      
      cleanedContent = cleanedContent || rawHtml;
    }

    // Transform the data
    const transformedPost = {
      id: fullPost.id,
      title: fullPost.title,
      subtitle: fullPost.subtitle || '',
      content: cleanedContent,
      excerpt: fullPost.excerpt,
      publishedAt: fullPost.publish_date,
      slug: fullPost.slug,
      thumbnailUrl: fullPost.thumbnail_url,
      webUrl: fullPost.web_url,
      tags: fullPost.content_tags || [],
      readTime: estimateReadTime(cleanedContent || fullPost.title + ' ' + (fullPost.subtitle || '')),
    };

    return NextResponse.json({ post: transformedPost });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

function estimateReadTime(content: string): string {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}