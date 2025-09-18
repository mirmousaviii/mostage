import { SyntaxHighlighter } from "../syntax-highlighter";

export interface MarkdownToken {
  type: string;
  content: string;
  level?: number;
  href?: string;
  title?: string;
}

export class MarkdownParser {
  private syntaxHighlighter: SyntaxHighlighter;

  constructor() {
    this.syntaxHighlighter = SyntaxHighlighter.getInstance();
  }

  parse(markdown: string): string {
    const slides = this.parseSlides(markdown);
    return slides.map((slide) => this.parseSlide(slide)).join("");
  }

  private parseSlides(markdown: string): string[] {
    const slides: string[] = [];
    const lines = markdown.split("\n");
    let currentSlide: string[] = [];

    for (const line of lines) {
      if (line.trim() === "---" && currentSlide.length > 0) {
        slides.push(currentSlide.join("\n"));
        currentSlide = [];
      } else if (line.trim() !== "---") {
        currentSlide.push(line);
      }
    }

    if (currentSlide.length > 0) {
      slides.push(currentSlide.join("\n"));
    }

    return slides;
  }

  private parseSlide(slideContent: string): string {
    const lines = slideContent.split("\n");
    const result: string[] = [];
    let inCodeBlock = false;
    let codeBlockLang = "";
    let codeBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.match(/^```/)) {
        if (!inCodeBlock) {
          // Start of code block
          inCodeBlock = true;
          codeBlockLang = line.replace(/^```/, "").trim();
          codeBlockContent = [];
        } else {
          // End of code block
          inCodeBlock = false;
          // Process collected code content with syntax highlighting
          const codeContent = codeBlockContent.join("\n");
          const highlightedCode = this.syntaxHighlighter.highlightCode(
            codeContent,
            codeBlockLang
          );
          result.push(
            `<pre><code class="language-${codeBlockLang}">${highlightedCode}</code></pre>`
          );
          codeBlockContent = [];
        }
        continue;
      }

      if (inCodeBlock) {
        // Collect code lines without processing
        codeBlockContent.push(line);
        continue;
      }

      // Handle tables
      if (line.match(/^\s*\|.*\|\s*$/)) {
        // Collect consecutive table lines
        const tableLines: string[] = [];
        let j = i;

        while (j < lines.length && lines[j].match(/^\s*\|.*\|\s*$/)) {
          tableLines.push(lines[j]);
          j++;
        }

        if (tableLines.length > 0) {
          const tableHtml = this.parseTable(tableLines);
          result.push(tableHtml);
          i = j - 1; // Skip the lines we just processed
        }
        continue;
      }

      // Handle lists
      if (line.match(/^[\s]*[-*+]\s/) || line.match(/^[\s]*\d+\.\s/)) {
        // Collect consecutive list items
        const listLines: string[] = [];
        let j = i;

        while (
          j < lines.length &&
          !lines[j].match(/^```/) &&
          (lines[j].match(/^[\s]*[-*+]\s/) ||
            lines[j].match(/^[\s]*\d+\.\s/) ||
            lines[j].trim() === "")
        ) {
          if (lines[j].trim() !== "") {
            listLines.push(lines[j]);
          }
          j++;
        }

        if (listLines.length > 0) {
          const { html } = this.parseListGroup(listLines, 0);
          result.push(html);
          i = j - 1; // Skip the lines we just processed
        }
        continue;
      }

      const parsedLine = this.parseLine(line);
      if (parsedLine.trim()) {
        result.push(parsedLine);
      }
    }

    return result.join("\n");
  }

  private parseTable(lines: string[]): string {
    if (lines.length < 2) return "";

    const headerLine = lines[0];
    const separatorLine = lines[1];
    const bodyLines = lines.slice(2);

    // Parse header
    const headerCells = headerLine
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "");

    // Check if separator line is valid
    if (!separatorLine.match(/^\s*\|[\s\-:|]+\|\s*$/)) {
      return "";
    }

    // Parse alignments from separator
    const alignments = separatorLine
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
      .map((cell) => {
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.endsWith(":")) return "right";
        return "left";
      });

    // Build table HTML
    let tableHtml = "<table>\n<thead>\n<tr>\n";

    headerCells.forEach((cell, index) => {
      const align = alignments[index] || "left";
      const alignAttr = align !== "left" ? ` style="text-align: ${align}"` : "";
      tableHtml += `<th${alignAttr}>${this.parseInlineFormatting(cell)}</th>\n`;
    });

    tableHtml += "</tr>\n</thead>\n<tbody>\n";

    // Parse body rows
    bodyLines.forEach((line) => {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell !== "");

      if (cells.length > 0) {
        tableHtml += "<tr>\n";
        cells.forEach((cell, index) => {
          const align = alignments[index] || "left";
          const alignAttr =
            align !== "left" ? ` style="text-align: ${align}"` : "";
          tableHtml += `<td${alignAttr}>${this.parseInlineFormatting(cell)}</td>\n`;
        });
        tableHtml += "</tr>\n";
      }
    });

    tableHtml += "</tbody>\n</table>";
    return tableHtml;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  private parseLine(line: string): string {
    // Skip empty lines
    if (!line.trim()) {
      return "";
    }

    // Handle headers
    if (line.match(/^#{1,6}\s/)) {
      return this.parseHeader(line);
    }

    // Handle blockquotes
    if (line.match(/^>\s/)) {
      return this.parseBlockquote(line);
    }

    // Handle horizontal rules
    if (line.match(/^---\s*$/)) {
      return "<hr>";
    }

    // Handle regular paragraphs with inline formatting
    return `<p>${this.parseInlineFormatting(line)}</p>`;
  }

  private parseListGroup(
    lines: string[],
    startIndex: number
  ): { html: string; nextIndex: number } {
    const listItems: Array<{
      content: string;
      level: number;
      type: "ul" | "ol";
    }> = [];
    let i = startIndex;

    // Collect all consecutive list items
    while (i < lines.length) {
      const line = lines[i];
      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s(.+)/);

      if (!listMatch) {
        break;
      }

      const indent = listMatch[1].length;
      const marker = listMatch[2];
      const content = listMatch[3];
      const type = marker.match(/\d+\./) ? "ol" : "ul";
      const level = Math.floor(indent / 2); // 2 spaces = 1 level

      listItems.push({
        content: this.parseInlineFormatting(content),
        level,
        type,
      });

      i++;
    }

    // Convert to nested HTML
    const html = this.buildNestedList(listItems);

    return { html, nextIndex: i };
  }

  private buildNestedList(
    items: Array<{ content: string; level: number; type: "ul" | "ol" }>
  ): string {
    if (items.length === 0) return "";

    // Group items by level and build tree structure
    const result: string[] = [];
    let i = 0;

    while (i < items.length) {
      const currentItem = items[i];
      result.push(`<${currentItem.type}>`);

      while (i < items.length && items[i].level === currentItem.level) {
        const item = items[i];
        result.push(`<li>${item.content}`);

        // Look ahead for nested items
        const nestedItems: Array<{
          content: string;
          level: number;
          type: "ul" | "ol";
        }> = [];
        let j = i + 1;

        while (j < items.length && items[j].level > item.level) {
          nestedItems.push(items[j]);
          j++;
        }

        if (nestedItems.length > 0) {
          result.push(this.buildNestedList(nestedItems));
          i = j - 1; // Skip the nested items we just processed
        }

        result.push("</li>");
        i++;
      }

      result.push(`</${currentItem.type}>`);
    }

    return result.join("");
  }

  private parseHeader(line: string): string {
    const match = line.match(/^(#{1,6})\s(.+)/);
    if (!match) return line;

    const level = match[1].length;
    const content = this.parseInlineFormatting(match[2]);
    return `<h${level}>${content}</h${level}>`;
  }

  private parseBlockquote(line: string): string {
    const content = line.replace(/^>\s/, "");
    const parsedContent = this.parseInlineFormatting(content);
    return `<blockquote>${parsedContent}</blockquote>`;
  }

  private parseInlineFormatting(text: string): string {
    // Process inline code first (highest priority)
    text = text.replace(/`([^`]*)`/g, (_, code) => {
      return `<code>${this.escapeHtml(code)}</code>`;
    });

    // Process images - ![alt](src) (must be processed before links)
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" />'
    );

    // Process links - [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Process strikethrough - ~~text~~
    text = text.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // Process bold - **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Process italic - *text* or _text_ (but avoid matching inside URLs)
    // Use negative lookbehind and lookahead to avoid matching underscores in URLs
    text = text.replace(
      /(?<![\w/])\*((?:[^*]|\*(?!\*))+)\*(?![\w/])/g,
      "<em>$1</em>"
    );
    text = text.replace(
      /(?<![\w/])_((?:[^_]|_(?!_))+)_(?![\w/])/g,
      "<em>$1</em>"
    );

    return text;
  }

  static parseMarkdownToSlides(markdown: string): string[] {
    const parser = new MarkdownParser();
    const slides = markdown.split(/^---\s*$/gm).filter((slide) => slide.trim());
    return slides.map((slide) => parser.parseSlide(slide.trim()));
  }
}
