import { MoSlide, ContentType } from "../types";
import { MarkdownParser, TextParser, HtmlParser } from "../utils/parsers";

export class ContentManager {
  private markdownParser: MarkdownParser;
  private textParser: TextParser;
  private htmlParser: HtmlParser;

  constructor() {
    this.markdownParser = new MarkdownParser();
    this.textParser = new TextParser();
    this.htmlParser = new HtmlParser();
  }

  async loadContentFromSource(
    sourcePath: string,
    _contentType: ContentType = "markdown"
  ): Promise<string> {
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

  parseContent(
    content: string,
    contentType: ContentType = "markdown"
  ): MoSlide[] {
    switch (contentType) {
      case "markdown":
        return this.parseMarkdown(content);
      case "html":
        return this.parseHtml(content);
      case "text":
        return this.parseText(content);
      default:
        console.warn(
          `Unknown content type: ${contentType}, defaulting to markdown`
        );
        return this.parseMarkdown(content);
    }
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

  private parseHtml(content: string): MoSlide[] {
    const slideContents = this.htmlParser.parseHtmlToSlides(content);

    return slideContents.map((slideContent, index) => ({
      id: `slide-${index}`,
      content: slideContent,
      html: this.htmlParser.processSlideContent(slideContent),
    }));
  }

  private parseText(content: string): MoSlide[] {
    const slideContents = content
      .split(/^---\s*$/gm)
      .filter((slide) => slide.trim());

    return slideContents.map((slideContent, index) => ({
      id: `slide-${index}`,
      content: slideContent.trim(),
      html: this.textParser.parseTextToHtml(slideContent.trim()),
    }));
  }
}
