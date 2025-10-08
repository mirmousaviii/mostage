import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Mostage } from "../../src/core/engine/mostage-engine";
import { ContentService } from "../../src/core/services/content-service";
import { ConfigService } from "../../src/core/services/config-service";
import { ThemeService } from "../../src/core/services/theme-service";
import {
  setupDOM,
  cleanupDOM,
  createMockConfig,
} from "../helpers/test-helpers";
import { TEST_DATA } from "../helpers/test-data";

describe("Services Integration Tests", () => {
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

  describe("Service Integration with Mostage", () => {
    it("should integrate ContentService with Mostage", async () => {
      const config = createMockConfig({
        content: TEST_DATA.MARKDOWN.BASIC,
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage.getTotalSlides()).toBe(4);
      expect(mostage.getCurrentSlide()).toBe(0);
    });

    it("should integrate ConfigService with Mostage", async () => {
      const config = createMockConfig({
        theme: "dark",
        transition: { type: "fade", duration: 500 },
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage.config.theme).toBe("dark");
      expect(mostage.config.transition.type).toBe("fade");
    });

    it("should integrate ThemeService with Mostage", async () => {
      const config = createMockConfig({
        theme: "ocean",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      expect(mostage.config.theme).toBe("ocean");
    });
  });

  describe("Service Error Handling", () => {
    it("should handle invalid configuration gracefully", async () => {
      const invalidConfig = createMockConfig({
        theme: "nonexistent-theme",
        transition: { type: "invalid", duration: -100 },
      });

      const mostage = new Mostage(invalidConfig);
      await mostage.start();

      // Should not crash
      expect(mostage.getCurrentSlide()).toBeDefined();
    });

    it("should handle content loading errors", async () => {
      // Mock fetch to return error
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
      ) as any;

      const config = createMockConfig({
        contentPath: "nonexistent.md",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Should handle error gracefully
      expect(mostage.getCurrentSlide()).toBeDefined();
    });

    it("should handle theme loading errors", async () => {
      const config = createMockConfig({
        theme: "nonexistent-theme",
      });

      const mostage = new Mostage(config);
      await mostage.start();

      // Should fallback to default theme
      expect(mostage.config.theme).toBeDefined();
    });
  });

  describe("Service Configuration", () => {
    it("should handle complex configuration", async () => {
      const complexConfig = createMockConfig({
        theme: "dark",
        transition: { type: "fade", duration: 600, easing: "ease-in-out" },
        plugins: {
          progressBar: { enabled: true, position: "top", height: "10px" },
          slideNumber: { enabled: true, format: "Slide {current} of {total}" },
        },
        keyboard: true,
        touch: true,
        urlHash: true,
        centerContent: { vertical: true, horizontal: true },
      });

      const mostage = new Mostage(complexConfig);
      await mostage.start();

      expect(mostage.config.theme).toBe("dark");
      expect(mostage.config.transition.type).toBe("fade");
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);
      expect(mostage.config.plugins.slideNumber.format).toBe(
        "Slide {current} of {total}"
      );
    });

    it("should handle configuration inheritance", async () => {
      const baseConfig = createMockConfig({
        theme: "light",
        transition: { type: "slide", duration: 300 },
      });

      const extendedConfig = {
        ...baseConfig,
        theme: "dark",
        plugins: { progressBar: { enabled: true } },
      };

      const mostage = new Mostage(extendedConfig);
      await mostage.start();

      expect(mostage.config.theme).toBe("dark");
      expect(mostage.config.transition.type).toBe("slide");
      expect(mostage.config.plugins.progressBar.enabled).toBe(true);
    });
  });
});
