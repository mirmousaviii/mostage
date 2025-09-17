/**
 * Smart Text Parser for Mostage
 * Converts plain text to HTML based on line position and content patterns
 */

export class TextParser {
  /**
   * Parse text content to HTML with smart formatting
   */
  parseTextToHtml(textContent: string): string {
    const lines = textContent.split('\n');
    const htmlLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        // Empty line - add a paragraph break
        htmlLines.push('<br>');
        continue;
      }
      
      // Determine heading level based on line position (1-6)
      const lineNumber = i + 1;
      let headingLevel = Math.min(lineNumber, 6);
      
      // Check if line looks like a heading (starts with capital letter or is short)
      const isHeading = this.isLikelyHeading(line, lineNumber);
      
      if (isHeading) {
        htmlLines.push(`<h${headingLevel} class="text-heading">${this.escapeHtml(line)}</h${headingLevel}>`);
      } else {
        // Regular content - determine if it's a list item, paragraph, etc.
        if (this.isListItem(line)) {
          htmlLines.push(`<li class="text-list-item">${this.escapeHtml(line)}</li>`);
        } else if (this.isEmphasizedText(line)) {
          htmlLines.push(`<p class="text-emphasis">${this.escapeHtml(line)}</p>`);
        } else {
          htmlLines.push(`<p class="text-paragraph">${this.escapeHtml(line)}</p>`);
        }
      }
    }
    
    return `<div class="text-content">${htmlLines.join('')}</div>`;
  }

  /**
   * Determine if a line is likely a heading based on content and position
   */
  private isLikelyHeading(line: string, lineNumber: number): boolean {
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
   * Check if a line is a list item
   */
  private isListItem(line: string): boolean {
    // Check for common list patterns
    return /^[-•*]\s/.test(line) || 
           /^\d+\.\s/.test(line) || 
           /^[a-zA-Z]\.\s/.test(line);
  }

  /**
   * Check if a line should be emphasized
   */
  private isEmphasizedText(line: string): boolean {
    // Text that should be emphasized (short, impactful statements)
    return line.length <= 30 && 
           (/^[A-Z]/.test(line) || 
            /[!?]$/.test(line) ||
            /^(Important|Note|Warning|Tip|Remember)/i.test(line));
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
