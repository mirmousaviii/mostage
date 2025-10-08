/**
 * Test Helpers
 * Common utilities and helper functions for tests
 */

import { vi } from "vitest";

/**
 * Create a mock HTMLElement with optional properties
 */
export function createMockElement(
  tagName: string = "div",
  options: {
    id?: string;
    className?: string;
    innerHTML?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {}
): HTMLElement {
  const element = document.createElement(tagName);

  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.innerHTML) element.innerHTML = options.innerHTML;
  if (options.style) {
    Object.assign(element.style, options.style);
  }

  return element;
}

/**
 * Create a mock Mostage instance
 */
export function createMockMostage(overrides: any = {}) {
  return {
    getCurrentSlide: vi.fn(() => 0),
    getTotalSlides: vi.fn(() => 5),
    getSlides: vi.fn(() => []),
    getContainer: vi.fn(() => document.createElement("div")),
    on: vi.fn(),
    emit: vi.fn(),
    nextSlide: vi.fn(),
    previousSlide: vi.fn(),
    goToSlide: vi.fn(),
    toggleOverview: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  };
}

/**
 * Create a mock fetch response
 */
export function createMockFetchResponse(
  data: any,
  options: {
    ok?: boolean;
    status?: number;
    statusText?: string;
  } = {}
) {
  const { ok = true, status = 200, statusText = "OK" } = options;

  return {
    ok,
    status,
    statusText,
    text: () =>
      Promise.resolve(typeof data === "string" ? data : JSON.stringify(data)),
    json: () => Promise.resolve(data),
  };
}

/**
 * Wait for a specified amount of time
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock file system
 */
export function createMockFileSystem() {
  return {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
    pathExists: vi.fn(),
    ensureDir: vi.fn(),
    remove: vi.fn(),
  };
}

/**
 * Setup DOM environment for tests
 */
export function setupDOM() {
  // Clear existing content
  document.body.innerHTML = "";
  document.head.innerHTML = "";

  // Add basic structure
  const container = document.createElement("div");
  container.id = "test-container";
  document.body.appendChild(container);

  return container;
}

/**
 * Clean up DOM after tests
 */
export function cleanupDOM() {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
}

/**
 * Create a mock configuration object
 */
export function createMockConfig(overrides: any = {}) {
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

/**
 * Create a mock slide object
 */
export function createMockSlide(overrides: any = {}) {
  return {
    id: "slide-0",
    content: "# Test Slide\n\nThis is a test slide.",
    html: "<h1>Test Slide</h1><p>This is a test slide.</p>",
    ...overrides,
  };
}

/**
 * Create a mock theme object
 */
export function createMockTheme(overrides: any = {}) {
  return {
    name: "light",
    cssContent: "/* light theme styles */",
    ...overrides,
  };
}

/**
 * Create a mock plugin configuration
 */
export function createMockPluginConfig(overrides: any = {}) {
  return {
    enabled: true,
    ...overrides,
  };
}

/**
 * Mock console methods to prevent noise in tests
 */
export function mockConsole() {
  const originalConsole = { ...console };

  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
  console.info = vi.fn();

  return {
    restore: () => {
      Object.assign(console, originalConsole);
    },
  };
}

/**
 * Create a mock event object
 */
export function createMockEvent(type: string, options: any = {}) {
  return {
    type,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...options,
  };
}

/**
 * Create a mock keyboard event
 */
export function createMockKeyboardEvent(key: string, options: any = {}) {
  return createMockEvent("keydown", {
    key,
    code: `Key${key.toUpperCase()}`,
    ...options,
  });
}

/**
 * Create a mock mouse event
 */
export function createMockMouseEvent(type: string, options: any = {}) {
  return createMockEvent(type, {
    clientX: 0,
    clientY: 0,
    button: 0,
    ...options,
  });
}

/**
 * Create a mock touch event
 */
export function createMockTouchEvent(
  type: string,
  touches: any[] = [],
  options: any = {}
) {
  return createMockEvent(type, {
    touches,
    changedTouches: touches,
    targetTouches: touches,
    ...options,
  });
}

/**
 * Assert that a function throws with a specific error
 */
export async function expectToThrow(
  fn: () => Promise<any> | any,
  expectedError?: string | RegExp | Error
) {
  try {
    const result = await fn();
    throw new Error("Expected function to throw, but it didn't");
  } catch (error) {
    if (expectedError) {
      if (typeof expectedError === "string") {
        expect(error.message).toContain(expectedError);
      } else if (expectedError instanceof RegExp) {
        expect(error.message).toMatch(expectedError);
      } else if (expectedError instanceof Error) {
        expect(error).toBeInstanceOf(expectedError.constructor);
        expect(error.message).toBe(expectedError.message);
      }
    }
  }
}

/**
 * Create a mock ResizeObserver
 */
export function createMockResizeObserver() {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });

  return mockResizeObserver;
}

/**
 * Create a mock IntersectionObserver
 */
export function createMockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });

  return mockIntersectionObserver;
}

/**
 * Create a mock MutationObserver
 */
export function createMockMutationObserver() {
  const mockMutationObserver = vi.fn();
  mockMutationObserver.mockReturnValue({
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
  });

  return mockMutationObserver;
}

/**
 * Setup global mocks for common browser APIs
 */
export function setupGlobalMocks() {
  // Mock ResizeObserver
  global.ResizeObserver = createMockResizeObserver();

  // Mock IntersectionObserver
  global.IntersectionObserver = createMockIntersectionObserver();

  // Mock MutationObserver
  global.MutationObserver = createMockMutationObserver();

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
  global.cancelAnimationFrame = vi.fn();

  // Mock matchMedia
  global.matchMedia = vi.fn(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * Clean up global mocks
 */
export function cleanupGlobalMocks() {
  vi.clearAllMocks();
}
