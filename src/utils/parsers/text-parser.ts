/**
 * Smart Text Parser for Mostage
 * Converts plain text to HTML based on line position and content patterns
 */

export class TextParser {
  /**
   * Parse text content to HTML with smart formatting
   */
  parseTextToHtml(textContent: string): string {
    const lines = textContent.split("\n");
    const htmlLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      // if (!line) {
      //   // Empty line - add a paragraph break
      //   htmlLines.push("<br>");
      //   i++;
      //   continue;
      // }

      // Determine heading level based on line position (1-6)
      const lineNumber = i + 1;
      let headingLevel = Math.min(lineNumber, 6);

      // Check for list items FIRST (higher priority than headings)
      if (this.isListItem(line)) {
        // Handle list - collect consecutive list items
        const listResult = this.parseList(lines, i);
        htmlLines.push(listResult.html);
        i = listResult.nextIndex;
      } else if (this.isLikelyHeading(line, lineNumber)) {
        // Check if line looks like a heading (starts with capital letter or is short)
        htmlLines.push(
          `<h${headingLevel} class="text-heading">${this.escapeHtml(line)}</h${headingLevel}>`
        );
        i++;
      } else if (this.isEmphasizedText(line)) {
        htmlLines.push(`<p class="text-emphasis">${this.escapeHtml(line)}</p>`);
        i++;
      } else {
        htmlLines.push(
          `<p class="text-paragraph">${this.escapeHtml(line)}</p>`
        );
        i++;
      }
    }

    return `<div class="text-content">${htmlLines.join("")}</div>`;
  }

  /**
   * Parse consecutive list items and return HTML with proper list containers
   */
  private parseList(
    lines: string[],
    startIndex: number
  ): { html: string; nextIndex: number } {
    const listItems: string[] = [];
    let i = startIndex;
    let listType: "ul" | "ol" = "ul";

    // Collect consecutive list items
    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        // Empty line - end of list
        i++;
        break;
      }

      if (this.isListItem(line)) {
        // Determine list type based on first item
        if (listItems.length === 0) {
          listType = this.getListType(line);
        }

        // Remove list marker and add as list item
        const cleanText = this.removeListMarker(line);
        listItems.push(`<li>${this.escapeHtml(cleanText)}</li>`);
        i++;
      } else {
        // Non-list item - end of list
        break;
      }
    }

    // Wrap list items in appropriate container (use standard HTML without custom classes)
    const html = `<${listType}>${listItems.join("")}</${listType}>`;

    return { html, nextIndex: i };
  }

  /**
   * Determine if a line is a list item
   */
  private isListItem(line: string): boolean {
    // Check for common list patterns
    return (
      /^[-•*]\s/.test(line) ||
      /^\d+\.\s/.test(line) ||
      /^[a-zA-Z]\.\s/.test(line)
    );
  }

  /**
   * Determine list type based on the first list item
   */
  private getListType(line: string): "ul" | "ol" {
    if (/^\d+\.\s/.test(line)) {
      return "ol"; // Ordered list for numbered items
    }
    return "ul"; // Unordered list for bullet points
  }

  /**
   * Remove list marker from line
   */
  private removeListMarker(line: string): string {
    return line
      .replace(/^[-•*]\s/, "")
      .replace(/^\d+\.\s/, "")
      .replace(/^[a-zA-Z]\.\s/, "");
  }

  /**
   * Determine if a line is likely a heading based on content and position
   */
  private isLikelyHeading(line: string, lineNumber: number): boolean {
    // Don't treat list items as headings
    if (this.isListItem(line)) return false;

    // First few lines are more likely to be headings
    if (lineNumber <= 3) return true;

    // Short lines are likely headings
    if (line.length <= 50) return true;

    // Lines that start with capital letters and don't end with punctuation
    if (/^[A-Z]/.test(line) && !/[.!?]$/.test(line)) return true;

    // Lines that are all caps (likely titles)
    if (line === line.toUpperCase() && line.length > 3) return true;

    return false;
  }

  /**
   * Check if a line should be emphasized
   */
  private isEmphasizedText(line: string): boolean {
    // Text that should be emphasized (short, impactful statements)
    return (
      line.length <= 30 &&
      (/^[A-Z]/.test(line) ||
        /[!?]$/.test(line) ||
        /^(Important|Note|Warning|Tip|Remember)/i.test(line))
    );
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
