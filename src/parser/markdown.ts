export interface MarkdownToken {
  type: string;
  content: string;
  level?: number;
  href?: string;
  title?: string;
}

export class MarkdownParser {
  constructor() {}

  parse(markdown: string): string {
    const slides = this.parseSlides(markdown);
    return slides.map(slide => this.parseSlide(slide)).join('');
  }

  private parseSlides(markdown: string): string[] {
    const slides: string[] = [];
    const lines = markdown.split('\n');
    let currentSlide: string[] = [];
    
    for (const line of lines) {
      if (line.trim() === '---' && currentSlide.length > 0) {
        slides.push(currentSlide.join('\n'));
        currentSlide = [];
      } else if (line.trim() !== '---') {
        currentSlide.push(line);
      }
    }
    
    if (currentSlide.length > 0) {
      slides.push(currentSlide.join('\n'));
    }
    
    return slides;
  }

  private parseSlide(slideContent: string): string {
    const lines = slideContent.split('\n');
    const parsedLines: string[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.match(/^```/)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.replace(/^```/, '').trim();
          parsedLines.push(`<pre><code class="language-${codeBlockLang}">`);
        } else {
          inCodeBlock = false;
          parsedLines.push('</code></pre>');
        }
        continue;
      }
      
      if (inCodeBlock) {
        parsedLines.push(line);
        continue;
      }
      
      const parsedLine = this.parseLine(line);
      if (parsedLine.trim()) {
        parsedLines.push(parsedLine);
      }
    }
    
    return parsedLines.join('\n');
  }

  private parseLine(line: string): string {
    // Skip empty lines
    if (!line.trim()) {
      return '';
    }
    
    // Handle headers
    if (line.match(/^#{1,6}\s/)) {
      return this.parseHeader(line);
    }
    
    // Handle lists
    if (line.match(/^[\s]*[-*+]\s/) || line.match(/^[\s]*\d+\.\s/)) {
      return this.parseList(line);
    }
    
    // Handle blockquotes
    if (line.match(/^>\s/)) {
      return this.parseBlockquote(line);
    }
    
    // Handle horizontal rules
    if (line.match(/^---\s*$/)) {
      return '<hr>';
    }
    
    // Handle regular paragraphs with inline formatting
    return `<p>${this.parseInlineFormatting(line)}</p>`;
  }

  private parseHeader(line: string): string {
    const match = line.match(/^(#{1,6})\s(.+)/);
    if (!match) return line;
    
    const level = match[1].length;
    const content = this.parseInlineFormatting(match[2]);
    return `<h${level}>${content}</h${level}>`;
  }

  private parseList(line: string): string {
    const isOrdered = line.match(/^\s*\d+\.\s/);
    const content = line.replace(/^[\s]*(?:[-*+]|\d+\.)\s/, '');
    const parsedContent = this.parseInlineFormatting(content);
    
    const tag = isOrdered ? 'ol' : 'ul';
    return `<${tag}><li>${parsedContent}</li></${tag}>`;
  }

  private parseBlockquote(line: string): string {
    const content = line.replace(/^>\s/, '');
    const parsedContent = this.parseInlineFormatting(content);
    return `<blockquote>${parsedContent}</blockquote>`;
  }

  private parseInlineFormatting(text: string): string {
    // Bold - **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic - *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Inline code - `code`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Links - [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    return text;
  }

  static parseMarkdownToSlides(markdown: string): string[] {
    const parser = new MarkdownParser();
    const slides = markdown.split(/^---\s*$/gm).filter(slide => slide.trim());
    return slides.map(slide => parser.parseSlide(slide.trim()));
  }
}
