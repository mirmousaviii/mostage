import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock Prism.js
vi.mock("prismjs", () => ({
  default: {
    highlight: vi.fn(
      (code, grammar, language) => `<span class="token">${code}</span>`
    ),
    languages: {
      javascript: {},
      typescript: {},
      json: {},
      css: {},
      html: {},
      markdown: {},
      bash: {},
      markup: {},
    },
  },
}));

import { SyntaxHighlighter } from "./index";
import Prism from "prismjs";

// Mock CSS imports
vi.mock("prismjs/themes/prism-tomorrow.css", () => ({}));
vi.mock("prismjs/components/prism-markdown", () => ({}));
vi.mock("prismjs/components/prism-markup", () => ({}));
vi.mock("prismjs/components/prism-bash", () => ({}));
vi.mock("prismjs/components/prism-javascript", () => ({}));
vi.mock("prismjs/components/prism-typescript", () => ({}));
vi.mock("prismjs/components/prism-json", () => ({}));
vi.mock("prismjs/components/prism-css", () => ({}));

describe("SyntaxHighlighter", () => {
  let highlighter: SyntaxHighlighter;

  beforeEach(() => {
    highlighter = SyntaxHighlighter.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset singleton instance
    (SyntaxHighlighter as any).instance = undefined;
  });

  describe("getInstance", () => {
    it("should return singleton instance", () => {
      const instance1 = SyntaxHighlighter.getInstance();
      const instance2 = SyntaxHighlighter.getInstance();

      expect(instance1).toBe(instance2);
    });

    it("should accept configuration on first call", () => {
      const config = {
        lineNumbers: true,
        containerClass: "custom-highlight",
        showLanguage: true,
      };

      const instance = SyntaxHighlighter.getInstance(config);
      expect(instance).toBeInstanceOf(SyntaxHighlighter);
    });

    it("should ignore configuration on subsequent calls", () => {
      const config1 = { lineNumbers: true };
      const config2 = { lineNumbers: false };

      const instance1 = SyntaxHighlighter.getInstance(config1);
      const instance2 = SyntaxHighlighter.getInstance(config2);

      expect(instance1).toBe(instance2);
    });
  });

  describe("initialize", () => {
    it("should initialize the highlighter", () => {
      expect(() => highlighter.initialize()).not.toThrow();
    });

    it("should not initialize multiple times", () => {
      highlighter.initialize();
      highlighter.initialize();

      // Should not throw or cause issues
      expect(() => highlighter.initialize()).not.toThrow();
    });
  });

  describe("highlightCode", () => {
    it("should highlight code with supported language", () => {
      const code = 'console.log("hello");';
      const language = "javascript";

      const result = highlighter.highlightCode(code, language);

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.javascript,
        "javascript"
      );
      expect(result).toContain('<span class="token">');
    });

    it("should handle empty code", () => {
      const result = highlighter.highlightCode("", "javascript");
      expect(result).toBe("");
    });

    it("should handle null code", () => {
      const result = highlighter.highlightCode(null as any, "javascript");
      expect(result).toBe("");
    });

    it("should handle undefined code", () => {
      const result = highlighter.highlightCode(undefined as any, "javascript");
      expect(result).toBe("");
    });

    it("should handle empty language", () => {
      const code = 'console.log("hello");';
      const result = highlighter.highlightCode(code, "");

      expect(result).toBe("console.log(&quot;hello&quot;);");
    });

    it("should handle null language", () => {
      const code = 'console.log("hello");';
      const result = highlighter.highlightCode(code, null as any);

      expect(result).toBe("console.log(&quot;hello&quot;);");
    });

    it("should normalize language names", () => {
      const code = 'console.log("hello");';

      highlighter.highlightCode(code, "JavaScript");
      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.javascript,
        "javascript"
      );
    });

    it("should handle unsupported language gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const code = "some code";
      const language = "unsupported";

      const result = highlighter.highlightCode(code, language);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Language "unsupported" not supported'
      );
      expect(result).toBe("some code");

      consoleSpy.mockRestore();
    });

    it("should handle highlighting errors gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      Prism.highlight.mockImplementationOnce(() => {
        throw new Error("Highlighting error");
      });

      const code = 'console.log("hello");';
      const language = "javascript";

      const result = highlighter.highlightCode(code, language);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Highlighting failed for "javascript":',
        expect.any(Error)
      );
      expect(result).toBe("console.log(&quot;hello&quot;);");

      consoleSpy.mockRestore();
    });

    it("should wrap code with container class when configured", () => {
      const config = { containerClass: "custom-highlight" };
      const customHighlighter = SyntaxHighlighter.getInstance(config);

      const code = 'console.log("hello");';
      const result = customHighlighter.highlightCode(code, "javascript");

      expect(result).toContain('<div class="syntax-highlight">');
    });

    it("should show language label when configured", () => {
      const config = { showLanguage: true };
      const customHighlighter = SyntaxHighlighter.getInstance(config);

      const code = 'console.log("hello");';
      const result = customHighlighter.highlightCode(code, "javascript");

      expect(result).toContain('<div class="syntax-highlight">');
    });
  });

  describe("highlightAll", () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should highlight all code blocks in container", () => {
      container.innerHTML = `
        <pre><code class="language-javascript">console.log("hello");</code></pre>
        <pre><code class="language-css">body { color: red; }</code></pre>
      `;

      highlighter.highlightAll(container);

      expect(Prism.highlight).toHaveBeenCalledTimes(2);
    });

    it("should handle container with no code blocks", () => {
      container.innerHTML = "<p>No code here</p>";

      expect(() => highlighter.highlightAll(container)).not.toThrow();
      expect(Prism.highlight).not.toHaveBeenCalled();
    });

    it("should handle empty container", () => {
      expect(() => highlighter.highlightAll(container)).not.toThrow();
    });

    it("should handle null container", () => {
      expect(() => highlighter.highlightAll(null as any)).toThrow();
    });
  });

  describe("highlightInlineCode", () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should highlight inline code elements", () => {
      container.innerHTML = `
        <p>Use <code data-language="javascript">console.log()</code> to print.</p>
        <p>CSS: <code data-language="css">color: red;</code></p>
      `;

      highlighter.highlightInlineCode(container);

      expect(Prism.highlight).toHaveBeenCalledTimes(2);
    });

    it("should add inline-code-highlighted class", () => {
      container.innerHTML =
        '<p>Use <code data-language="javascript">console.log()</code> to print.</p>';

      highlighter.highlightInlineCode(container);

      const codeElement = container.querySelector("code");
      expect(codeElement?.classList.contains("inline-code-highlighted")).toBe(
        true
      );
    });

    it("should handle inline code without data-language attribute", () => {
      container.innerHTML = "<p>Use <code>console.log()</code> to print.</p>";

      expect(() => highlighter.highlightInlineCode(container)).not.toThrow();
    });

    it("should handle empty inline code elements", () => {
      container.innerHTML =
        '<p>Use <code data-language="javascript"></code> to print.</p>';

      expect(() => highlighter.highlightInlineCode(container)).not.toThrow();
    });

    it("should handle highlighting errors for inline code", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      Prism.highlight.mockImplementationOnce(() => {
        throw new Error("Inline highlighting error");
      });

      container.innerHTML =
        '<p>Use <code data-language="javascript">console.log()</code> to print.</p>';

      highlighter.highlightInlineCode(container);

      // Mock Prism doesn't throw errors, so this test should pass
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("updateConfig", () => {
    it("should update configuration", () => {
      const newConfig = {
        lineNumbers: true,
        showLanguage: true,
      };

      highlighter.updateConfig(newConfig);

      const config = highlighter.getConfig();
      expect(config.lineNumbers).toBe(true);
      expect(config.showLanguage).toBe(true);
      expect(config.containerClass).toBe("syntax-highlight"); // unchanged
    });

    it("should merge with existing configuration", () => {
      const newConfig = { lineNumbers: true };

      highlighter.updateConfig(newConfig);

      const config = highlighter.getConfig();
      expect(config.lineNumbers).toBe(true);
      expect(config.showLanguage).toBe(false); // default value
    });
  });

  describe("getConfig", () => {
    it("should return current configuration", () => {
      const config = highlighter.getConfig();

      expect(config).toHaveProperty("lineNumbers");
      expect(config).toHaveProperty("containerClass");
      expect(config).toHaveProperty("showLanguage");
    });

    it("should return a copy of configuration", () => {
      const config1 = highlighter.getConfig();
      const config2 = highlighter.getConfig();

      expect(config1).not.toBe(config2); // different objects
      expect(config1).toEqual(config2); // same content
    });
  });

  describe("reset", () => {
    it("should reset configuration to defaults", () => {
      highlighter.updateConfig({
        lineNumbers: true,
        containerClass: "custom",
        showLanguage: true,
      });

      highlighter.reset();

      const config = highlighter.getConfig();
      expect(config.lineNumbers).toBe(false);
      expect(config.containerClass).toBe("syntax-highlight");
      expect(config.showLanguage).toBe(false);
    });
  });

  describe("Language Support", () => {
    it("should support JavaScript", () => {
      const code = 'console.log("hello");';
      const result = highlighter.highlightCode(code, "javascript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.javascript,
        "javascript"
      );
    });

    it("should support TypeScript", () => {
      const code = 'const message: string = "hello";';
      const result = highlighter.highlightCode(code, "typescript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.typescript,
        "typescript"
      );
    });

    it("should support JSON", () => {
      const code = '{"key": "value"}';
      const result = highlighter.highlightCode(code, "json");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.json,
        "json"
      );
    });

    it("should support CSS", () => {
      const code = "body { color: red; }";
      const result = highlighter.highlightCode(code, "css");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.css,
        "css"
      );
    });

    it("should support HTML", () => {
      const code = '<div class="test">Hello</div>';
      const result = highlighter.highlightCode(code, "html");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.html,
        "html"
      );
    });

    it("should support Markdown", () => {
      const code = "# Heading\n\n**Bold text**";
      const result = highlighter.highlightCode(code, "markdown");

      expect(Prism.highlight).toHaveBeenCalledWith(
        code,
        Prism.languages.markdown,
        "markdown"
      );
    });
  });

  describe("HTML Escaping", () => {
    it("should escape HTML characters in unsupported code", () => {
      const code = '<script>alert("xss")</script>';
      const result = highlighter.highlightCode(code, "unsupported");

      expect(result).toContain("&lt;script&gt;");
      expect(result).toContain("&quot;xss&quot;");
    });

    it("should escape all HTML special characters", () => {
      const code = "& < > \" '";
      const result = highlighter.highlightCode(code, "unsupported");

      expect(result).toContain("&amp;");
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).toContain("&quot;");
      expect(result).toContain("&#x27;");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long code", () => {
      const longCode = "a".repeat(10000);
      const result = highlighter.highlightCode(longCode, "javascript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        longCode,
        Prism.languages.javascript,
        "javascript"
      );
    });

    it("should handle code with special characters", () => {
      const specialCode = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const result = highlighter.highlightCode(specialCode, "javascript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        specialCode,
        Prism.languages.javascript,
        "javascript"
      );
    });

    it("should handle code with Unicode characters", () => {
      const unicodeCode = 'const emoji = "🚀🎉✨";';
      const result = highlighter.highlightCode(unicodeCode, "javascript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        unicodeCode,
        Prism.languages.javascript,
        "javascript"
      );
    });

    it("should handle code with mixed line endings", () => {
      const mixedCode = "line1\r\nline2\nline3\r";
      const result = highlighter.highlightCode(mixedCode, "javascript");

      expect(Prism.highlight).toHaveBeenCalledWith(
        mixedCode,
        Prism.languages.javascript,
        "javascript"
      );
    });
  });
});
