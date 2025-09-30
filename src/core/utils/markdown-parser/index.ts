import { marked } from "marked";

/**
 * Markdown parser using marked.js
 * Supports HTML within markdown content
 */
export class MarkdownParser {
  constructor() {
    // Configure marked with appropriate settings for presentations
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  /**
   * Parse markdown content to HTML
   * @param content - Markdown content string
   * @returns HTML string
   */
  parse(content: string): string {
    if (!content || content.trim() === "") {
      return "";
    }

    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return `<p>Error parsing markdown content</p>`;
    }
  }
}
