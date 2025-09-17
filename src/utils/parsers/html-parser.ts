/**
 * HTML Parser for Mostage
 * Handles HTML content with slide separation
 */

export class HtmlParser {
  /**
   * Parse HTML content to slides
   */
  parseHtmlToSlides(htmlContent: string): string[] {
    const slideContents = htmlContent
      .split(/^---\s*$/gm)
      .filter((slide) => slide.trim());

    return slideContents.map((slideContent) => slideContent.trim());
  }

  /**
   * Process HTML content for a single slide
   */
  processSlideContent(content: string): string {
    // For HTML, we use content as-is but ensure proper formatting
    return content.trim();
  }
}
