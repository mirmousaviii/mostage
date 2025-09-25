import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";

export class SyntaxHighlighter {
  private static instance: SyntaxHighlighter;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SyntaxHighlighter {
    if (!SyntaxHighlighter.instance) {
      SyntaxHighlighter.instance = new SyntaxHighlighter();
    }
    return SyntaxHighlighter.instance;
  }

  initialize(): void {
    if (this.isInitialized) return;

    // Load Prism CSS theme
    this.loadPrismCSS();
    this.isInitialized = true;
  }

  private loadPrismCSS(): void {
    // Create a link element for Prism CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
    link.id = "prism-css";

    // Check if already loaded
    if (!document.getElementById("prism-css")) {
      document.head.appendChild(link);
    }
  }

  highlightCode(code: string, language: string): string {
    this.initialize();

    // Normalize language name
    const normalizedLang = this.normalizeLanguage(language);

    // Check if language is supported
    if (!Prism.languages[normalizedLang]) {
      // Fallback to plain text
      return this.escapeHtml(code);
    }

    try {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[normalizedLang],
        normalizedLang
      );
      return highlighted;
    } catch (error) {
      console.warn(
        `Failed to highlight code for language "${normalizedLang}":`,
        error
      );
      return this.escapeHtml(code);
    }
  }

  private normalizeLanguage(language: string): string {
    const langMap: { [key: string]: string } = {
      js: "javascript",
      ts: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      py: "python",
      rb: "ruby",
      sh: "bash",
      yml: "yaml",
      md: "markdown",
      xml: "markup",
      html: "markup",
      svg: "markup",
      mathml: "markup",
      ssml: "markup",
      atom: "markup",
      rss: "markup",
      txt: "text",
      text: "text",
    };

    const normalized = language.toLowerCase().trim();
    return langMap[normalized] || normalized;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  // Method to highlight all code blocks in a container
  highlightAll(container: HTMLElement): void {
    this.initialize();

    const codeBlocks = container.querySelectorAll(
      'pre code[class*="language-"]'
    );
    codeBlocks.forEach((block) => {
      const codeElement = block as HTMLElement;
      const className = codeElement.className;
      const languageMatch = className.match(/language-(\w+)/);

      if (languageMatch) {
        const language = languageMatch[1];
        const code = codeElement.textContent || "";
        const highlighted = this.highlightCode(code, language);
        codeElement.innerHTML = highlighted;
      }
    });
  }
}
