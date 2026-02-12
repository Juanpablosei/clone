/**
 * Helper functions to extract data from news blocks
 */

interface NewsBlock {
  type: string;
  imageUrl?: string | null;
  content?: string | null;
  order: number;
}

/**
 * Extracts the first image from blocks
 */
export function getFirstImageFromBlocks(blocks: NewsBlock[] | null | undefined): string | null {
  if (!blocks || blocks.length === 0) return null;
  
  const imageBlock = blocks
    .filter((block) => block.type === "image" && block.imageUrl)
    .sort((a, b) => a.order - b.order)[0];
  
  return imageBlock?.imageUrl || null;
}

/**
 * Extracts the first content block text (strips HTML for preview)
 */
export function getFirstContentFromBlocks(blocks: NewsBlock[] | null | undefined): string | null {
  if (!blocks || blocks.length === 0) return null;
  
  const contentBlock = blocks
    .filter((block) => block.type === "content" && block.content)
    .sort((a, b) => a.order - b.order)[0];
  
  if (!contentBlock?.content) return null;
  
  // Strip HTML tags for preview text
  const textContent = contentBlock.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
  
  return textContent || null;
}

/**
 * Gets preview image: first from blocks, fallback to legacy image field
 */
export function getPreviewImage(
  blocks: NewsBlock[] | null | undefined,
  legacyImage: string | null | undefined
): string | null {
  return getFirstImageFromBlocks(blocks) || legacyImage || null;
}

/**
 * Gets preview content: first from blocks, fallback to legacy content/summary fields
 */
export function getPreviewContent(
  blocks: NewsBlock[] | null | undefined,
  legacySummary: string | null | undefined,
  legacyContent: string | null | undefined
): string | null {
  const blockContent = getFirstContentFromBlocks(blocks);
  if (blockContent) return blockContent;
  
  if (legacySummary) return legacySummary;
  
  if (legacyContent) {
    // Strip HTML if present
    return legacyContent
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  return null;
}

