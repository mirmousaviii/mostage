import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";

/**
 * Syntax Highlighter Configuration
 */
export interface SyntaxHighlighterConfig {
  /** Enable line numbers */
  lineNumbers?: boolean;
  /** Custom CSS class for container */
  containerClass?: string;
  /** Show language label */
  showLanguage?: boolean;
}

/**
 * Professional Syntax Highlighter
 *
 * A clean, efficient syntax highlighter using Prism.js
 * Supports standard Markdown language names
 */
export class SyntaxHighlighter {
  private static instance: SyntaxHighlighter;
  private isInitialized = false;
  private config: SyntaxHighlighterConfig;

  private constructor(config: SyntaxHighlighterConfig = {}) {
    this.config = {
      lineNumbers: false,
      containerClass: "syntax-highlight",
      showLanguage: false,
      ...config,
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: SyntaxHighlighterConfig): SyntaxHighlighter {
    if (!SyntaxHighlighter.instance) {
      SyntaxHighlighter.instance = new SyntaxHighlighter(config);
    }
    return SyntaxHighlighter.instance;
  }

  /**
   * Initialize the highlighter
   */
  initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  /**
   * Highlight code with specified language
   */
  highlightCode(code: string, language: string): string {
    this.initialize();

    if (!code?.trim() || !language?.trim()) {
      return this.escapeHtml(code || "");
    }

    const normalizedLang = this.normalizeLanguage(language);

    if (!this.isLanguageSupported(normalizedLang)) {
      console.warn(`Language "${normalizedLang}" not supported`);
      return this.escapeHtml(code);
    }

    try {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[normalizedLang],
        normalizedLang
      );
      return this.wrapCode(highlighted, normalizedLang);
    } catch (error) {
      console.error(`Highlighting failed for "${normalizedLang}":`, error);
      return this.escapeHtml(code);
    }
  }

  /**
   * Highlight all code blocks in container
   */
  highlightAll(container: HTMLElement): void {
    this.initialize();

    const codeBlocks = container.querySelectorAll<HTMLElement>(
      'pre code[class*="language-"]'
    );
    codeBlocks.forEach((block) => this.highlightCodeBlock(block));
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SyntaxHighlighterConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SyntaxHighlighterConfig {
    return { ...this.config };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = {
      lineNumbers: false,
      containerClass: "syntax-highlight",
      showLanguage: false,
    };
  }

  // Private methods

  private isLanguageSupported(language: string): boolean {
    return language in Prism.languages;
  }

  private normalizeLanguage(language: string): string {
    return language?.toLowerCase().trim() || "text";
  }

  private escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
    };

    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }

  private wrapCode(highlightedCode: string, language: string): string {
    let wrapped = highlightedCode;

    if (this.config.showLanguage) {
      wrapped = `<div class="language-label">${language}</div>${wrapped}`;
    }

    if (this.config.containerClass) {
      wrapped = `<div class="${this.config.containerClass}">${wrapped}</div>`;
    }

    return wrapped;
  }

  private highlightCodeBlock(block: HTMLElement): void {
    const className = block.className;
    const languageMatch = className.match(/language-(\w+)/);

    if (!languageMatch) return;

    const language = languageMatch[1];
    const code = block.textContent || "";

    if (!code.trim()) return;

    const highlighted = this.highlightCode(code, language);
    block.innerHTML = highlighted;
  }
}

// Export default instance for convenience
export const syntaxHighlighter = SyntaxHighlighter.getInstance();
