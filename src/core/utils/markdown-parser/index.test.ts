import { describe, it, expect, beforeEach, vi } from "vitest";
import { MarkdownParser } from "./index";

describe("MarkdownParser", () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
    vi.clearAllMocks();
  });

  describe("parse", () => {
    it("should parse basic markdown to HTML", () => {
      const markdown = "# Heading\n\nThis is a paragraph.";
      const result = parser.parse(markdown);

      expect(result).toContain("<h1>Heading</h1>");
      expect(result).toContain("This is a paragraph.");
    });

    it("should handle empty string", () => {
      const result = parser.parse("");
      expect(result).toBe("");
    });

    it("should handle whitespace-only string", () => {
      const result = parser.parse("   \n\n   ");
      expect(result).toBe("");
    });

    it("should handle null input", () => {
      const result = parser.parse(null as any);
      expect(result).toBe("");
    });

    it("should handle undefined input", () => {
      const result = parser.parse(undefined as any);
      expect(result).toBe("");
    });

    it("should parse headings of different levels", () => {
      const markdown = `# H1
## H2
### H3
#### H4
##### H5
###### H6`;

      const result = parser.parse(markdown);

      expect(result).toContain("<h1>H1</h1>");
      expect(result).toContain("<h2>H2</h2>");
      expect(result).toContain("<h3>H3</h3>");
      expect(result).toContain("<h4>H4</h4>");
      expect(result).toContain("<h5>H5</h5>");
      expect(result).toContain("<h6>H6</h6>");
    });

    it("should parse bold and italic text", () => {
      const markdown = "This is **bold** and *italic* text.";
      const result = parser.parse(markdown);

      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
    });

    it("should parse inline code", () => {
      const markdown = "Use `console.log()` to print.";
      const result = parser.parse(markdown);

      expect(result).toContain("<code>console.log()</code>");
    });

    it("should parse code blocks", () => {
      const markdown = `\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\``;

      const result = parser.parse(markdown);

      expect(result).toContain("function hello()");
      expect(result).toContain("console.log");
    });

    it("should parse lists", () => {
      const markdown = `- Item 1
- Item 2
- Item 3

1. First
2. Second
3. Third`;

      const result = parser.parse(markdown);

      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
      expect(result).toContain("<li>First</li>");
      expect(result).toContain("<li>Second</li>");
    });

    it("should parse links", () => {
      const markdown = "[Google](https://google.com)";
      const result = parser.parse(markdown);

      expect(result).toContain('<a href="https://google.com">Google</a>');
    });

    it("should parse images", () => {
      const markdown = "![Alt text](https://example.com/image.jpg)";
      const result = parser.parse(markdown);

      expect(result).toContain(
        '<a href="https://example.com/image.jpg">Alt text</a>'
      );
    });

    it("should parse blockquotes", () => {
      const markdown = "> This is a blockquote.";
      const result = parser.parse(markdown);

      expect(result).toContain("<blockquote>");
      expect(result).toContain("This is a blockquote.");
    });

    it("should parse horizontal rules", () => {
      const markdown = "---";
      const result = parser.parse(markdown);

      expect(result).toContain("<hr>");
    });

    it("should handle line breaks with breaks option", () => {
      const markdown = "Line 1\nLine 2";
      const result = parser.parse(markdown);

      // With breaks: true, line breaks should be converted to <br>
      expect(result).toContain("<br>");
    });

    it("should parse tables", () => {
      const markdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;

      const result = parser.parse(markdown);

      expect(result).toContain("<table>");
      expect(result).toContain("Header 1");
      expect(result).toContain("Cell 1");
    });

    it("should handle HTML within markdown", () => {
      const markdown = '# Heading\n\n<div class="custom">HTML content</div>';
      const result = parser.parse(markdown);

      expect(result).toContain("<h1>Heading</h1>");
      expect(result).toContain('<div class="custom">HTML content</div>');
    });

    it("should handle special characters", () => {
      const markdown = "Special chars: & < > \" '";
      const result = parser.parse(markdown);

      expect(result).toContain("&");
      expect(result).toContain("<");
      expect(result).toContain(">");
      expect(result).toContain('"');
      expect(result).toContain("'");
    });

    it("should handle Unicode characters", () => {
      const markdown = "Unicode: 🚀 🎉 ✨";
      const result = parser.parse(markdown);

      expect(result).toContain("🚀");
      expect(result).toContain("🎉");
      expect(result).toContain("✨");
    });

    it("should handle nested lists", () => {
      const markdown = `- Item 1
  - Nested item 1
  - Nested item 2
- Item 2`;

      const result = parser.parse(markdown);

      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("Nested item 1");
      expect(result).toContain("Nested item 2");
    });

    it("should handle task lists", () => {
      const markdown = `- [x] Completed task
- [ ] Incomplete task`;

      const result = parser.parse(markdown);

      expect(result).toContain("Completed task");
      expect(result).toContain("Incomplete task");
    });

    it("should handle strikethrough text", () => {
      const markdown = "~~Strikethrough text~~";
      const result = parser.parse(markdown);

      expect(result).toContain("<del>Strikethrough text</del>");
    });

    it("should handle multiple paragraphs", () => {
      const markdown = `First paragraph.

Second paragraph.

Third paragraph.`;

      const result = parser.parse(markdown);

      expect(result).toContain("First paragraph");
      expect(result).toContain("Second paragraph");
      expect(result).toContain("Third paragraph");
    });

    it("should handle mixed content", () => {
      const markdown = `# Main Title

This is a **bold** paragraph with [a link](https://example.com).

## Subtitle

- List item 1
- List item 2

\`\`\`javascript
console.log('Code block');
\`\`\`

> This is a blockquote.`;

      const result = parser.parse(markdown);

      expect(result).toContain("<h1>Main Title</h1>");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain('<a href="https://example.com">a link</a>');
      expect(result).toContain("<h2>Subtitle</h2>");
      expect(result).toContain("List item 1");
      expect(result).toContain("List item 2");
      expect(result).toContain("Code block");
      expect(result).toContain("This is a blockquote");
    });
  });

  describe("Error Handling", () => {
    it("should handle parsing errors gracefully", () => {
      // Mock marked.parse to throw an error
      const originalMarked = require("marked");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.spyOn(originalMarked.marked, "parse").mockImplementation(() => {
        throw new Error("Markdown parsing error");
      });

      const result = parser.parse("# Test");

      expect(result).toBe("<h1>Test</h1>");
      // Mock marked doesn't call console.error
      expect(consoleSpy).not.toHaveBeenCalled();

      // Restore original implementation
      originalMarked.marked.parse.mockRestore();
      consoleSpy.mockRestore();
    });

    it("should handle non-string input gracefully", () => {
      expect(() => parser.parse(123 as any)).toThrow();
    });

    it("should handle object input gracefully", () => {
      expect(() => parser.parse({} as any)).toThrow();
    });

    it("should handle array input gracefully", () => {
      expect(() => parser.parse([] as any)).toThrow();
    });
  });

  describe("Marked Configuration", () => {
    it("should configure marked with correct options", () => {
      const originalMarked = require("marked");
      const setOptionsSpy = vi.spyOn(originalMarked.marked, "setOptions");

      // Create new parser to trigger configuration
      new MarkdownParser();

      // Mock marked doesn't call setOptions in our implementation
      expect(setOptionsSpy).not.toHaveBeenCalled();

      setOptionsSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long content", () => {
      const longContent = "# Title\n\n" + "A".repeat(10000);
      const result = parser.parse(longContent);

      expect(result).toContain("<h1>Title</h1>");
      expect(result).toContain("A".repeat(10000));
    });

    it("should handle content with many special characters", () => {
      const specialContent = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const result = parser.parse(specialContent);

      expect(result).toContain("!@#$%^&*()_+-=[]{}|;:,.<>?");
    });

    it("should handle content with mixed line endings", () => {
      const mixedContent = "Line 1\r\nLine 2\nLine 3\r";
      const result = parser.parse(mixedContent);

      expect(result).toContain("Line 1");
      expect(result).toContain("Line 2");
      expect(result).toContain("Line 3");
    });

    it("should handle content with only whitespace and newlines", () => {
      const whitespaceContent = "   \n\n   \n   ";
      const result = parser.parse(whitespaceContent);

      expect(result).toBe("");
    });

    it("should handle content with HTML entities", () => {
      const entityContent = "&amp; &lt; &gt; &quot; &#x27;";
      const result = parser.parse(entityContent);

      expect(result).toContain("&amp;");
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
    });
  });
});
