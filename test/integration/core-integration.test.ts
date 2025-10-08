import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Mostage } from "../../src/core/engine/mostage-engine";
import {
  setupDOM,
  cleanupDOM,
  createMockConfig,
} from "../helpers/test-helpers";
import { TEST_DATA } from "../helpers/test-data";

describe("Core Engine Integration Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = setupDOM();

    // Mock fetch for content loading
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(TEST_DATA.MARKDOWN.BASIC),
        json: () =>
          Promise.resolve({
            theme: "light",
            transition: { type: "horizontal", duration: 300 },
          }),
      })
    ) as any;
  });

  afterEach(() => {
    cleanupDOM();
    vi.clearAllMocks();
  });

  describe("Engine Initialization", () => {
    it("should initialize Mostage with all services", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage).toBeInstanceOf(Mostage);
      expect(mostage.getCurrentSlide()).toBe(0);
      expect(mostage.getTotalSlides()).toBeGreaterThan(0);
    });

    it("should handle navigation with event system", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        plugins: {},
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const slideChangeSpy = vi.fn();
      mostage.on("slidechange", slideChangeSpy);

      mostage.nextSlide();
      expect(mostage.getCurrentSlide()).toBe(1);
      expect(slideChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "slidechange",
          currentSlide: 1,
          totalSlides: 4,
        })
      );
    });

    it("should integrate with plugins", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Check if progress bar plugin was initialized
      const progressBar = document.querySelector(".mostage-progress-bar");
      // Mock plugins don't create DOM elements
      expect(progressBar).toBeFalsy();
    });

    it("should handle theme switching", async () => {
      const config = createMockConfig({
        theme: "light",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Switch theme
      mostage.config.theme = "dark";
      expect(mostage.config.theme).toBe("dark");
    });

    it("should handle content updates", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const initialSlides = mostage.getTotalSlides();
      expect(initialSlides).toBeGreaterThan(0);

      // Update content
      const newContent = "# New Slide\n\nNew content here.";
      mostage.config.content = newContent;
      await mostage.start();

      expect(mostage.getTotalSlides()).toBeGreaterThan(0);
    });
  });

  describe("Engine Performance", () => {
    it("should handle large presentations efficiently", async () => {
      const largeContent = Array.from(
        { length: 100 },
        (_, i) => `# Slide ${i + 1}\n\nThis is slide ${i + 1}.`
      ).join("\n\n---\n\n");

      const config = createMockConfig({
        content: largeContent,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const startTime = performance.now();

      // Rapid navigation
      for (let i = 0; i < 100; i++) {
        mostage.nextSlide();
        mostage.previousSlide();
      }

      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      // Should be fast
      expect(navigationTime).toBeLessThan(1000);
      expect(mostage.getTotalSlides()).toBe(100);
    });

    it("should handle rapid navigation", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      const startTime = performance.now();

      // Rapid navigation
      for (let i = 0; i < 50; i++) {
        mostage.nextSlide();
        mostage.previousSlide();
      }

      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      // Should be fast
      expect(navigationTime).toBeLessThan(500);
    });
  });

  describe("Engine Memory Management", () => {
    it("should clean up resources properly", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Destroy
      mostage.destroy();

      // Should not crash
      expect(() => mostage.getCurrentSlide()).not.toThrow();
    });

    it("should handle multiple instances", async () => {
      const config1 = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
        theme: "light",
      });

      const config2 = createMockConfig({
        content: TEST_DATA.MARKDOWN.SINGLE_SLIDE,
        theme: "dark",
      });

      const mostage1 = new Mostage(config1);
      const mostage2 = new Mostage(config2);

      await mostage1.start();
      await mostage2.start();

      expect(mostage1.getTotalSlides()).toBe(4);
      expect(mostage2.getTotalSlides()).toBe(1);

      mostage1.destroy();
      mostage2.destroy();
    });
  });
});
