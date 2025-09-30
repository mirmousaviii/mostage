import { MoSlide } from "../types";
import { MarkdownParser } from "../utils/markdown-parser";

/**
 * Enhanced Content Service with better error handling and validation
 * Provides content loading, parsing, and validation functionality
 */
export class ContentService {
  private markdownParser: MarkdownParser;
  private cache: Map<string, string> = new Map();

  constructor() {
    this.markdownParser = new MarkdownParser();
  }

  /**
   * Load content from various sources (file, URL, etc.)
   * @param sourcePath - Path or URL to the content
   * @returns Promise<string> - The loaded content
   */
  async loadContentFromSource(sourcePath: string): Promise<string> {
    try {
      // Check cache first
      if (this.cache.has(sourcePath)) {
        return this.cache.get(sourcePath)!;
      }

      const response = await fetch(sourcePath);

      if (!response.ok) {
        throw new ContentLoadError(
          `Failed to load content from ${sourcePath}: ${response.status} ${response.statusText}`,
          sourcePath,
          response.status
        );
      }

      const content = await response.text();

      // Validate content
      this.validateContent(content);

      // Cache the content
      this.cache.set(sourcePath, content);

      return content;
    } catch (error) {
      if (error instanceof ContentLoadError) {
        throw error;
      }

      throw new ContentLoadError(
        `Error loading content from ${sourcePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
        sourcePath
      );
    }
  }

  /**
   * Parse content into slides
   * @param content - Raw content string
   * @returns Array of parsed slides
   */
  parseContent(content: string): MoSlide[] {
    try {
      this.validateContent(content);
      return this.parseMarkdown(content);
    } catch (error) {
      throw new ContentParseError(
        `Failed to parse content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Parse markdown content to HTML
   * @param content - Markdown content
   * @returns HTML string
   */
  parseMarkdownToHtml(content: string): string {
    try {
      return this.markdownParser.parse(content);
    } catch (error) {
      throw new ContentParseError(
        `Failed to parse markdown: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Clear content cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Parse markdown content into slides
   * @param content - Raw markdown content
   * @returns Array of slides
   */
  private parseMarkdown(content: string): MoSlide[] {
    const slideContents = content
      .split(/^---\s*$/gm)
      .filter((slide) => slide.trim());

    if (slideContents.length === 0) {
      throw new ContentParseError("No slides found in content");
    }

    return slideContents.map((slideContent, index) => {
      const trimmedContent = slideContent.trim();

      return {
        id: `slide-${index}`,
        content: trimmedContent,
        html: this.markdownParser.parse(trimmedContent),
      };
    });
  }

  /**
   * Validate content before processing
   * @param content - Content to validate
   */
  private validateContent(content: string): void {
    if (!content || typeof content !== "string") {
      throw new ContentValidationError("Content must be a non-empty string");
    }

    if (content.trim().length === 0) {
      throw new ContentValidationError("Content cannot be empty");
    }

    // Check for minimum content length
    if (content.length < 10) {
      throw new ContentValidationError(
        "Content is too short to be a valid presentation"
      );
    }
  }
}

/**
 * Custom error classes for better error handling
 */
export class ContentError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ContentLoadError extends ContentError {
  constructor(
    message: string,
    public readonly sourcePath: string,
    public readonly statusCode?: number
  ) {
    super(message, "CONTENT_LOAD_ERROR");
  }
}

export class ContentParseError extends ContentError {
  constructor(message: string) {
    super(message, "CONTENT_PARSE_ERROR");
  }
}

export class ContentValidationError extends ContentError {
  constructor(message: string) {
    super(message, "CONTENT_VALIDATION_ERROR");
  }
}
