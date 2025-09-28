import { MoSlide } from "./mostage";
import { MarkdownParser } from "../utils/markdown-parser";

export class ContentManager {
  private markdownParser: MarkdownParser;

  constructor() {
    this.markdownParser = new MarkdownParser();
  }

  async loadContentFromSource(sourcePath: string): Promise<string> {
    try {
      const response = await fetch(sourcePath);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error loading content from source:", error);
      throw error;
    }
  }

  parseContent(content: string): MoSlide[] {
    return this.parseMarkdown(content);
  }

  parseMarkdownToHtml(content: string): string {
    return this.markdownParser.parse(content);
  }

  private parseMarkdown(content: string): MoSlide[] {
    const slideContents = content
      .split(/^---\s*$/gm)
      .filter((slide) => slide.trim());

    return slideContents.map((slideContent, index) => ({
      id: `slide-${index}`,
      content: slideContent.trim(),
      html: this.markdownParser.parse(slideContent.trim()),
    }));
  }
}
