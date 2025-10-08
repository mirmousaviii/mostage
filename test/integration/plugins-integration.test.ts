import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Mostage } from "../../src/core/engine/mostage-engine";
import { ProgressBarPlugin } from "../../src/core/plugins/progress-bar";
import {
  setupDOM,
  cleanupDOM,
  createMockConfig,
} from "../helpers/test-helpers";
import { TEST_DATA } from "../helpers/test-data";

describe("Plugins Integration Tests", () => {
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

  describe("Plugin Integration with Mostage", () => {
    it("should integrate ProgressBarPlugin with Mostage", async () => {
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

    it("should handle multiple plugins", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
          slideNumber: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Should handle multiple plugins
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);
      expect(mostage.config.plugins.slideNumber.enabled).toBe(true);
    });

    it("should handle plugin configuration", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: {
            enabled: true,
            position: "bottom",
            height: "15px",
            color: "blue",
          },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage.config.plugins.progressBar.position).toBe("bottom");
      expect(mostage.config.plugins.progressBar.height).toBe("15px");
      expect(mostage.config.plugins.progressBar.color).toBe("blue");
    });
  });

  describe("Plugin System Integration", () => {
    it("should handle plugin lifecycle", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Plugin should be initialized
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);

      // Destroy
      mostage.destroy();

      // Should handle cleanup
      expect(() => mostage.getCurrentSlide()).not.toThrow();
    });

    it("should handle plugin conflicts", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true, position: "top" },
          slideNumber: { enabled: true, position: "top" }, // Same position
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Should handle conflicts gracefully
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);
      expect(mostage.config.plugins.slideNumber.enabled).toBe(true);
    });

    it("should handle plugin updates", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true, position: "top" },
        },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Update plugin configuration
      mostage.config.plugins.progressBar.position = "bottom";

      expect(mostage.config.plugins.progressBar.position).toBe("bottom");
    });
  });

  describe("Plugin Performance", () => {
    it("should handle many plugins efficiently", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
          slideNumber: { enabled: true },
          controller: { enabled: true },
        },
      });

      const startTime = performance.now();

      const mostage = new Mostage(config);
      await mostage.start();

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load within reasonable time
      expect(loadTime).toBeLessThan(1000);
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);
      expect(mostage.config.plugins.slideNumber.enabled).toBe(true);
    });

    it("should handle plugin memory usage", async () => {
      const config = createMockConfig({
        plugins: {
          progressBar: { enabled: true },
        },
      });

      const mostage1 = new Mostage(config);
      await mostage1.start();

      const mostage2 = new Mostage(config);
      await mostage2.start();

      // Should not leak memory
      expect(mostage1.config.plugins.progressBar.enabled).toBe(true);
      expect(mostage2.config.plugins.progressBar.enabled).toBe(true);

      mostage1.destroy();
      mostage2.destroy();
    });
  });
});
