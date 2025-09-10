export function estimateReadTime(content: string): string {
  if (!content) return '1 min read';
  
  // Strip HTML tags and decode entities to get plain text
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Replace HTML entities with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const wordsPerMinute = 200;
  const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return `${minutes} min read`;
}