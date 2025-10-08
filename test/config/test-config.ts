/**
 * Test Configuration
 * Centralized configuration for all test files
 */

export const TEST_CONFIG = {
  // Test timeouts
  TIMEOUTS: {
    DEFAULT: 10000,
    LONG_RUNNING: 30000,
    SHORT: 5000,
  },

  // Mock data
  MOCK_DATA: {
    // Sample markdown content
    MARKDOWN_CONTENT: `# Test Presentation

This is a test presentation with multiple slides.

---

## Slide 2

This is the second slide with some content.

- List item 1
- List item 2
- List item 3

---

## Slide 3

This is the third slide with code:

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

---

## Slide 4

This is the final slide with an image:

![Test Image](https://example.com/image.jpg)`,

    // Sample configuration
    SAMPLE_CONFIG: {
      theme: "dark",
      scale: 1.0,
      transition: {
        type: "horizontal",
        duration: 300,
        easing: "ease-in-out",
      },
      loop: false,
      plugins: {
        progressBar: { enabled: true },
        slideNumber: { enabled: true },
      },
      keyboard: true,
      touch: true,
      urlHash: false,
      centerContent: {
        vertical: true,
        horizontal: true,
      },
    },

    // Sample theme CSS
    SAMPLE_THEME_CSS: `/* Dark Theme */
.mostage-container {
  background-color: #1a1a1a;
  color: #ffffff;
}

.mostage-slide {
  background-color: #2d2d2d;
  color: #ffffff;
}`,

    // Sample plugin configuration
    SAMPLE_PLUGIN_CONFIG: {
      progressBar: {
        enabled: true,
        position: "bottom",
        color: "#007acc",
        height: "12px",
      },
      slideNumber: {
        enabled: true,
        position: "bottom-right",
        format: "{current}/{total}",
      },
    },
  },

  // Test file paths
  PATHS: {
    TEST_PROJECT: "/test/project",
    TEST_CONTENT: "/test/project/content.md",
    TEST_CONFIG: "/test/project/config.json",
    TEST_OUTPUT: "/test/output",
    TEST_ASSETS: "/test/project/assets",
  },

  // Expected values
  EXPECTED: {
    DEFAULT_SLIDE_COUNT: 4,
    DEFAULT_THEME: "light",
    DEFAULT_TRANSITION: "horizontal",
    SUPPORTED_FORMATS: ["html", "pdf", "pptx", "png", "jpg"],
    SUPPORTED_THEMES: ["dark", "light", "dracula", "ocean", "rainbow"],
    SUPPORTED_PLUGINS: ["ProgressBar", "SlideNumber", "Controller", "Confetti"],
  },

  // Error messages
  ERROR_MESSAGES: {
    ELEMENT_NOT_FOUND: "Element not found",
    CONTENT_NOT_PROVIDED: "No content provided",
    INVALID_CONFIG: "Invalid configuration",
    THEME_NOT_FOUND: "Theme not found",
    PLUGIN_NOT_FOUND: "Plugin not found",
    FILE_NOT_FOUND: "File not found",
    NETWORK_ERROR: "Network error",
    PARSE_ERROR: "Parse error",
  },

  // Test utilities
  UTILS: {
    // Create a mock HTMLElement
    createMockElement: (tagName: string = "div", id?: string): HTMLElement => {
      const element = document.createElement(tagName);
      if (id) element.id = id;
      return element;
    },

    // Create a mock Mostage instance
    createMockMostage: () => ({
      getCurrentSlide: () => 0,
      getTotalSlides: () => 5,
      getSlides: () => [],
      getContainer: () => document.createElement("div"),
      on: vi.fn(),
      emit: vi.fn(),
      nextSlide: vi.fn(),
      previousSlide: vi.fn(),
      goToSlide: vi.fn(),
      toggleOverview: vi.fn(),
      destroy: vi.fn(),
    }),

    // Create a mock fetch response
    createMockFetchResponse: (
      data: any,
      ok: boolean = true,
      status: number = 200
    ) => ({
      ok,
      status,
      statusText: ok ? "OK" : "Error",
      text: () =>
        Promise.resolve(typeof data === "string" ? data : JSON.stringify(data)),
      json: () => Promise.resolve(data),
    }),

    // Wait for async operations
    waitFor: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

    // Create a mock file system
    createMockFileSystem: () => ({
      readFile: vi.fn(),
      writeFile: vi.fn(),
      readdir: vi.fn(),
      stat: vi.fn(),
      pathExists: vi.fn(),
      ensureDir: vi.fn(),
      remove: vi.fn(),
    }),
  },
};

// Import vi for type checking
import { vi } from "vitest";
