/**
 * Mock Factories
 * Factory functions for creating mock objects and data
 */

import { vi } from "vitest";

/**
 * Factory for creating mock configurations
 */
export class ConfigFactory {
  static createBasic(overrides: any = {}) {
    return {
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
      ...overrides,
    };
  }

  static createWithPlugins(plugins: any = {}) {
    return this.createBasic({ plugins });
  }

  static createWithTheme(theme: string) {
    return this.createBasic({ theme });
  }

  static createWithContent(content: string) {
    return this.createBasic({ content });
  }

  static createWithTransition(transition: any) {
    return this.createBasic({ transition });
  }

  static createMinimal() {
    return {
      element: "#test-container",
      content: "# Test",
    };
  }

  static createInvalid() {
    return {
      element: "#non-existent",
      theme: 123, // should be string
      scale: "invalid", // should be number
    };
  }
}

/**
 * Factory for creating mock slides
 */
export class SlideFactory {
  static createBasic(overrides: any = {}) {
    return {
      id: "slide-0",
      content: "# Test Slide\n\nThis is a test slide.",
      html: "<h1>Test Slide</h1><p>This is a test slide.</p>",
      ...overrides,
    };
  }

  static createMultiple(count: number = 3) {
    return Array.from({ length: count }, (_, index) =>
      this.createBasic({
        id: `slide-${index}`,
        content: `# Slide ${index + 1}\n\nThis is slide ${index + 1}.`,
        html: `<h1>Slide ${index + 1}</h1><p>This is slide ${index + 1}.</p>`,
      })
    );
  }

  static createWithCode() {
    return this.createBasic({
      content: `# Code Slide

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\``,
      html: `<h1>Code Slide</h1><pre><code class="language-javascript">function hello() {
  console.log('Hello, World!');
}</code></pre>`,
    });
  }

  static createWithImage() {
    return this.createBasic({
      content: `# Image Slide

![Test Image](https://example.com/image.jpg)`,
      html: `<h1>Image Slide</h1><img src="https://example.com/image.jpg" alt="Test Image">`,
    });
  }

  static createWithList() {
    return this.createBasic({
      content: `# List Slide

- Item 1
- Item 2
- Item 3`,
      html: `<h1>List Slide</h1><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`,
    });
  }
}

/**
 * Factory for creating mock themes
 */
export class ThemeFactory {
  static createBasic(overrides: any = {}) {
    return {
      name: "light",
      cssContent: "/* light theme styles */",
      ...overrides,
    };
  }

  static createDark() {
    return this.createBasic({
      name: "dark",
      cssContent: "/* dark theme styles */",
    });
  }

  static createCustom(name: string, css: string) {
    return this.createBasic({
      name,
      cssContent: css,
    });
  }

  static createMultiple() {
    return [
      this.createBasic(),
      this.createDark(),
      this.createCustom("ocean", "/* ocean theme styles */"),
      this.createCustom("rainbow", "/* rainbow theme styles */"),
    ];
  }
}

/**
 * Factory for creating mock plugins
 */
export class PluginFactory {
  static createBasic(overrides: any = {}) {
    return {
      name: "TestPlugin",
      init: vi.fn(),
      destroy: vi.fn(),
      isEnabled: vi.fn(() => true),
      setEnabled: vi.fn(),
      ...overrides,
    };
  }

  static createProgressBar(config: any = {}) {
    return {
      name: "ProgressBar",
      init: vi.fn(),
      destroy: vi.fn(),
      isEnabled: vi.fn(() => true),
      setEnabled: vi.fn(),
      config: {
        enabled: true,
        position: "bottom",
        color: "#007acc",
        height: "12px",
        ...config,
      },
    };
  }

  static createSlideNumber(config: any = {}) {
    return {
      name: "SlideNumber",
      init: vi.fn(),
      destroy: vi.fn(),
      isEnabled: vi.fn(() => true),
      setEnabled: vi.fn(),
      config: {
        enabled: true,
        position: "bottom-right",
        format: "{current}/{total}",
        ...config,
      },
    };
  }

  static createController(config: any = {}) {
    return {
      name: "Controller",
      init: vi.fn(),
      destroy: vi.fn(),
      isEnabled: vi.fn(() => true),
      setEnabled: vi.fn(),
      config: {
        enabled: true,
        showPlayButton: true,
        showProgress: true,
        ...config,
      },
    };
  }
}

/**
 * Factory for creating mock services
 */
export class ServiceFactory {
  static createContentService() {
    return {
      parseContent: vi.fn(() => [SlideFactory.createBasic()]),
      loadContentFromSource: vi.fn(() =>
        Promise.resolve("# Test Slide\n\nThis is a test slide.")
      ),
      parseMarkdownToHtml: vi.fn((content) => `<h1>${content}</h1>`),
      clearCache: vi.fn(),
      getCacheStats: vi.fn(() => ({ size: 0, keys: [] })),
    };
  }

  static createThemeService() {
    return {
      loadTheme: vi.fn(() => Promise.resolve()),
      getCurrentTheme: vi.fn(() => ThemeFactory.createBasic()),
      getAvailableThemes: vi.fn(() => ThemeFactory.createMultiple()),
      getTheme: vi.fn((name) => ThemeFactory.createBasic({ name })),
      hasTheme: vi.fn(() => true),
      registerTheme: vi.fn(),
    };
  }

  static createNavigationService() {
    return {
      navigateToSlide: vi.fn(),
      getCurrentSlide: vi.fn(() => 0),
      getTotalSlides: vi.fn(() => 5),
      setSlides: vi.fn(),
      setCurrentSlideIndex: vi.fn(),
      enableTouch: vi.fn(),
      disableTouch: vi.fn(),
      enableKeyboard: vi.fn(),
      disableKeyboard: vi.fn(),
      destroy: vi.fn(),
    };
  }

  static createPluginService() {
    return {
      initializePlugins: vi.fn(() => Promise.resolve()),
      destroyPlugins: vi.fn(),
      registerPlugin: vi.fn(),
      unregisterPlugin: vi.fn(),
      getPlugin: vi.fn(),
      getPlugins: vi.fn(() => []),
    };
  }
}

/**
 * Factory for creating mock DOM elements
 */
export class DOMFactory {
  static createContainer(id: string = "test-container") {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  }

  static createSlideElement(content: string = "Test content") {
    const slide = document.createElement("div");
    slide.className = "mostage-slide";
    slide.innerHTML = content;
    return slide;
  }

  static createProgressBar() {
    const progressBar = document.createElement("div");
    progressBar.className = "mostage-progress-bar";

    const fill = document.createElement("div");
    fill.className = "mostage-progress-fill";
    progressBar.appendChild(fill);

    return progressBar;
  }

  static createNavigation() {
    const nav = document.createElement("div");
    nav.className = "mostage-navigation";

    const prev = document.createElement("button");
    prev.className = "mostage-prev";
    prev.textContent = "Previous";

    const next = document.createElement("button");
    next.className = "mostage-next";
    next.textContent = "Next";

    nav.appendChild(prev);
    nav.appendChild(next);

    return nav;
  }
}

/**
 * Factory for creating mock events
 */
export class EventFactory {
  static createKeyboardEvent(key: string, options: any = {}) {
    return new KeyboardEvent("keydown", {
      key,
      code: `Key${key.toUpperCase()}`,
      ...options,
    });
  }

  static createMouseEvent(type: string, options: any = {}) {
    return new MouseEvent(type, {
      clientX: 0,
      clientY: 0,
      button: 0,
      ...options,
    });
  }

  static createTouchEvent(
    type: string,
    touches: any[] = [],
    options: any = {}
  ) {
    return new TouchEvent(type, {
      touches: touches as any,
      changedTouches: touches as any,
      targetTouches: touches as any,
      ...options,
    });
  }

  static createCustomEvent(type: string, detail: any = {}) {
    return new CustomEvent(type, { detail });
  }
}

/**
 * Factory for creating mock fetch responses
 */
export class FetchFactory {
  static createSuccessResponse(data: any) {
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      text: () =>
        Promise.resolve(typeof data === "string" ? data : JSON.stringify(data)),
      json: () => Promise.resolve(data),
    };
  }

  static createErrorResponse(
    status: number = 404,
    statusText: string = "Not Found"
  ) {
    return {
      ok: false,
      status,
      statusText,
      text: () => Promise.reject(new Error(statusText)),
      json: () => Promise.reject(new Error(statusText)),
    };
  }

  static createNetworkError() {
    return Promise.reject(new Error("Network error"));
  }
}

/**
 * Factory for creating mock file system
 */
export class FileSystemFactory {
  static createMock() {
    return {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      readdir: vi.fn(),
      stat: vi.fn(),
      pathExists: vi.fn(),
      ensureDir: vi.fn(),
      remove: vi.fn(),
      copy: vi.fn(),
      move: vi.fn(),
    };
  }

  static createWithFiles(files: Record<string, string>) {
    const mock = this.createMock();
    mock.readFile.mockImplementation((path: string) => {
      if (files[path]) {
        return Promise.resolve(files[path]);
      }
      return Promise.reject(new Error("File not found"));
    });
    mock.pathExists.mockImplementation((path: string) => {
      return Promise.resolve(!!files[path]);
    });
    return mock;
  }
}
