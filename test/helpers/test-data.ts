/**
 * Test Data
 * Centralized test data and constants
 */

export const TEST_DATA = {
  // Sample markdown content
  MARKDOWN: {
    BASIC: `# Test Presentation

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

    SINGLE_SLIDE: `# Single Slide

This is a single slide presentation.`,

    WITH_HTML: `# HTML Slide

<div class="custom">
  <p>HTML content</p>
</div>

---

# Another Slide

<iframe src="https://example.com"></iframe>`,

    WITH_SPECIAL_CHARS: `# Special Characters

Special chars: & < > " '

---

# Unicode

Unicode: 🚀 🎉 ✨`,

    WITH_TABLES: `# Table Slide

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`,

    WITH_BLOCKQUOTES: `# Quote Slide

> This is a blockquote.
> 
> It can span multiple lines.

---

# Another Quote

> Single line quote.`,
  },

  // Sample configurations
  CONFIG: {
    BASIC: {
      element: "#test-container",
      theme: "light",
      content: "# Test Slide\n\nThis is a test slide.",
      transition: {
        type: "horizontal",
        duration: 300,
        easing: "ease-in-out",
      },
      scale: 1.0,
      loop: false,
      plugins: {},
      keyboard: true,
      touch: true,
      urlHash: false,
      centerContent: {
        vertical: true,
        horizontal: true,
      },
    },

    WITH_PLUGINS: {
      element: "#test-container",
      theme: "dark",
      content: "# Test Slide\n\nThis is a test slide.",
      plugins: {
        progressBar: { enabled: true },
        slideNumber: { enabled: true },
        controller: { enabled: true },
      },
    },

    WITH_BACKGROUND: {
      element: "#test-container",
      theme: "ocean",
      content: "# Test Slide\n\nThis is a test slide.",
      background: { type: "image", value: "bg.jpg" },
    },

    WITH_HEADER_FOOTER: {
      element: "#test-container",
      theme: "light",
      content: "# Test Slide\n\nThis is a test slide.",
      header: "My Header",
      footer: "My Footer",
    },

    MINIMAL: {
      element: "#test-container",
      content: "# Test",
    },

    INVALID: {
      element: "#non-existent",
      theme: 123, // should be string
      scale: "invalid", // should be number
    },
  },

  // Sample themes
  THEMES: {
    LIGHT: {
      name: "light",
      cssContent: `/* Light Theme */
.mostage-container {
  background-color: #ffffff;
  color: #000000;
}

.mostage-slide {
  background-color: #ffffff;
  color: #000000;
}`,
    },

    DARK: {
      name: "dark",
      cssContent: `/* Dark Theme */
.mostage-container {
  background-color: #1a1a1a;
  color: #ffffff;
}

.mostage-slide {
  background-color: #2d2d2d;
  color: #ffffff;
}`,
    },

    OCEAN: {
      name: "ocean",
      cssContent: `/* Ocean Theme */
.mostage-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.mostage-slide {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}`,
    },

    RAINBOW: {
      name: "rainbow",
      cssContent: `/* Rainbow Theme */
.mostage-container {
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  color: #ffffff;
}

.mostage-slide {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}`,
    },
  },

  // Sample plugin configurations
  PLUGINS: {
    PROGRESS_BAR: {
      enabled: true,
      position: "bottom",
      color: "#007acc",
      height: "12px",
    },

    SLIDE_NUMBER: {
      enabled: true,
      position: "bottom-right",
      format: "{current}/{total}",
    },

    CONTROLLER: {
      enabled: true,
      showPlayButton: true,
      showProgress: true,
      showFullscreen: true,
    },

    CONFETTI: {
      enabled: true,
      colors: ["#ff0000", "#00ff00", "#0000ff"],
      particleCount: 100,
    },
  },

  // Sample slides
  SLIDES: {
    BASIC: {
      id: "slide-0",
      content: "# Test Slide\n\nThis is a test slide.",
      html: "<h1>Test Slide</h1><p>This is a test slide.</p>",
    },

    WITH_CODE: {
      id: "slide-1",
      content: `# Code Slide

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\``,
      html: `<h1>Code Slide</h1><pre><code class="language-javascript">function hello() {
  console.log('Hello, World!');
}</code></pre>`,
    },

    WITH_IMAGE: {
      id: "slide-2",
      content: `# Image Slide

![Test Image](https://example.com/image.jpg)`,
      html: `<h1>Image Slide</h1><img src="https://example.com/image.jpg" alt="Test Image">`,
    },

    WITH_LIST: {
      id: "slide-3",
      content: `# List Slide

- Item 1
- Item 2
- Item 3`,
      html: `<h1>List Slide</h1><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`,
    },
  },

  // Sample CSS content
  CSS: {
    BASE: `/* Base Styles */
.mostage-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.mostage-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}`,

    TYPOGRAPHY: `/* Typography */
.mostage-slide h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.mostage-slide h2 {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.mostage-slide h3 {
  font-size: 2rem;
  margin-bottom: 0.6rem;
}

.mostage-slide p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}`,

    RESPONSIVE: `/* Responsive */
@media (max-width: 768px) {
  .mostage-slide {
    padding: 1rem;
  }
  
  .mostage-slide h1 {
    font-size: 2rem;
  }
  
  .mostage-slide h2 {
    font-size: 1.8rem;
  }
  
  .mostage-slide h3 {
    font-size: 1.5rem;
  }
  
  .mostage-slide p {
    font-size: 1rem;
  }
}`,
  },

  // Sample file paths
  PATHS: {
    TEST_PROJECT: "/test/project",
    TEST_CONTENT: "/test/project/content.md",
    TEST_CONFIG: "/test/project/config.json",
    TEST_OUTPUT: "/test/output",
    TEST_ASSETS: "/test/project/assets",
    TEST_TEMPLATES: "/test/project/templates",
  },

  // Expected values
  EXPECTED: {
    DEFAULT_SLIDE_COUNT: 4,
    DEFAULT_THEME: "light",
    DEFAULT_TRANSITION: "horizontal",
    SUPPORTED_FORMATS: ["html", "pdf", "pptx", "png", "jpg"],
    SUPPORTED_THEMES: ["dark", "light", "dracula", "ocean", "rainbow"],
    SUPPORTED_PLUGINS: ["ProgressBar", "SlideNumber", "Controller", "Confetti"],
    SUPPORTED_TRANSITIONS: ["horizontal", "vertical", "fade", "slide", "zoom"],
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
    VALIDATION_ERROR: "Validation error",
    LOAD_ERROR: "Load error",
  },

  // Test timeouts
  TIMEOUTS: {
    DEFAULT: 10000,
    LONG_RUNNING: 30000,
    SHORT: 5000,
    NETWORK: 15000,
  },

  // Sample URLs
  URLS: {
    LOCAL_CONFIG: "http://localhost:3000/config.json",
    LOCAL_CONTENT: "http://localhost:3000/content.md",
    EXTERNAL_CONFIG: "https://example.com/config.json",
    EXTERNAL_CONTENT: "https://example.com/content.md",
    INVALID_URL: "https://invalid-url-that-does-not-exist.com/config.json",
  },

  // Sample file contents
  FILES: {
    CONFIG_JSON: `{
  "element": "#presentation",
  "theme": "dark",
  "content": "# My Presentation\\n\\nWelcome to my presentation!",
  "plugins": {
    "progressBar": { "enabled": true },
    "slideNumber": { "enabled": true }
  }
}`,

    CONTENT_MD: `# My Presentation

Welcome to my presentation!

---

## Slide 2

This is the second slide.

---

## Slide 3

This is the final slide.`,

    HEADER_HTML: `<div class="header">
  <h1>My Presentation</h1>
  <p>Created with Mostage</p>
</div>`,

    FOOTER_HTML: `<div class="footer">
  <p>&copy; 2024 My Company</p>
</div>`,
  },
};

// Export individual sections for convenience
export const {
  MARKDOWN,
  CONFIG,
  THEMES,
  PLUGINS,
  SLIDES,
  CSS,
  PATHS,
  EXPECTED,
  ERROR_MESSAGES,
  TIMEOUTS,
  URLS,
  FILES,
} = TEST_DATA;
