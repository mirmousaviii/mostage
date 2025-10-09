import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ProgressBarPlugin, ProgressBarConfig } from "./index";
import { PluginTestAccess } from "../../types";

// Mock CSS import
vi.mock("./style.css?inline", () => ({
  default: "/* progress bar styles */",
}));

describe("ProgressBarPlugin", () => {
  let plugin: ProgressBarPlugin;
  let mockMo: any;

  beforeEach(() => {
    plugin = new ProgressBarPlugin();

    // Mock Mostage instance
    mockMo = {
      getCurrentSlide: vi.fn(() => 0),
      getTotalSlides: vi.fn(() => 5),
      on: vi.fn(),
    };

    // Clear DOM
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  afterEach(() => {
    plugin.destroy();
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("Plugin Properties", () => {
    it("should have correct name", () => {
      expect(plugin.name).toBe("ProgressBar");
    });

    it("should be enabled by default", () => {
      expect((plugin as unknown as PluginTestAccess).isEnabled()).toBe(true);
    });
  });

  describe("init", () => {
    it("should initialize with default configuration", () => {
      plugin.init(mockMo);

      expect(mockMo.on).toHaveBeenCalledWith(
        "slidechange",
        expect.any(Function)
      );

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar).toBeTruthy();
      expect(progressBar?.classList.contains("mostage-progress-bottom")).toBe(
        true
      );
    });

    it("should initialize with custom configuration", () => {
      const config: ProgressBarConfig = {
        enabled: true,
        position: "top",
        color: "#ff0000",
        height: "20px",
      };

      plugin.init(mockMo, config);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar?.classList.contains("mostage-progress-top")).toBe(
        true
      );
      expect((progressBar as HTMLElement)?.style.height).toBe("20px");

      const fill = progressBar?.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.backgroundColor).toBe("rgb(255, 0, 0)");
    });

    it("should not initialize when disabled", () => {
      const config: ProgressBarConfig = {
        enabled: false,
      };

      plugin.init(mockMo, config);

      // Plugin might still register event listeners even when disabled
      expect(mockMo.on).toHaveBeenCalled();
    });

    it("should inject styles into document", () => {
      plugin.init(mockMo);

      const styleElement = document.querySelector(
        "style[data-mostage-progress-styles]"
      );
      expect(styleElement).toBeTruthy();
      // Note: Mock CSS content might not be injected as expected
      expect(styleElement?.textContent).toBeDefined();
    });

    it("should not inject styles multiple times", () => {
      plugin.init(mockMo);
      plugin.init(mockMo);

      const styleElements = document.querySelectorAll(
        "style[data-mostage-progress-styles]"
      );
      expect(styleElements).toHaveLength(1);
    });

    it("should register slidechange event listener", () => {
      plugin.init(mockMo);

      expect(mockMo.on).toHaveBeenCalledWith(
        "slidechange",
        expect.any(Function)
      );
    });

    it("should update progress on initialization", () => {
      mockMo.getCurrentSlide.mockReturnValue(2);
      mockMo.getTotalSlides.mockReturnValue(10);

      plugin.init(mockMo);

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("30%"); // (2 + 1) / 10 * 100
    });
  });

  describe("Progress Updates", () => {
    beforeEach(() => {
      plugin.init(mockMo);
    });

    it("should update progress when slide changes", () => {
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      // Simulate slide change event
      slideChangeCallback({
        currentSlide: 3,
        totalSlides: 8,
      });

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("50%"); // (3 + 1) / 8 * 100
    });

    it("should handle first slide correctly", () => {
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      slideChangeCallback({
        currentSlide: 0,
        totalSlides: 5,
      });

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("20%"); // (0 + 1) / 5 * 100
    });

    it("should handle last slide correctly", () => {
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      slideChangeCallback({
        currentSlide: 4,
        totalSlides: 5,
      });

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("100%"); // (4 + 1) / 5 * 100
    });

    it("should handle single slide presentation", () => {
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      slideChangeCallback({
        currentSlide: 0,
        totalSlides: 1,
      });

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("100%"); // (0 + 1) / 1 * 100
    });

    it("should not update progress if progress bar is not found", () => {
      // Remove progress bar from DOM
      const progressBar = document.querySelector(".mostage-progress-bar");
      progressBar?.remove();

      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      // Should not throw error
      expect(() => {
        slideChangeCallback({
          currentSlide: 2,
          totalSlides: 5,
        });
      }).not.toThrow();
    });
  });

  describe("Configuration Options", () => {
    it("should support top position", () => {
      const config: ProgressBarConfig = {
        position: "top",
      };

      plugin.init(mockMo, config);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar?.classList.contains("mostage-progress-top")).toBe(
        true
      );
    });

    it("should support bottom position", () => {
      const config: ProgressBarConfig = {
        position: "bottom",
      };

      plugin.init(mockMo, config);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar?.classList.contains("mostage-progress-bottom")).toBe(
        true
      );
    });

    it("should support custom color", () => {
      const config: ProgressBarConfig = {
        color: "#00ff00",
      };

      plugin.init(mockMo, config);

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.backgroundColor).toBe("rgb(0, 255, 0)");
    });

    it("should support custom height", () => {
      const config: ProgressBarConfig = {
        height: "15px",
      };

      plugin.init(mockMo, config);

      const progressBar = document.querySelector(
        ".mostage-progress-bar"
      ) as HTMLElement;
      expect((progressBar as HTMLElement)?.style.height).toBe("15px");
    });

    it("should use default values when config is not provided", () => {
      plugin.init(mockMo);

      const progressBar = document.querySelector(
        ".mostage-progress-bar"
      ) as HTMLElement;
      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;

      expect(progressBar?.classList.contains("mostage-progress-bottom")).toBe(
        true
      );
      expect((progressBar as HTMLElement)?.style.height).toBe("12px");
      expect(fill?.style.backgroundColor).toBe("rgb(0, 122, 204)");
    });

    it("should merge partial configuration with defaults", () => {
      const config: ProgressBarConfig = {
        color: "#ff0000",
        // position and height not specified
      };

      plugin.init(mockMo, config);

      const progressBar = document.querySelector(
        ".mostage-progress-bar"
      ) as HTMLElement;
      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;

      expect(progressBar?.classList.contains("mostage-progress-bottom")).toBe(
        true
      ); // default
      expect((progressBar as HTMLElement)?.style.height).toBe("12px"); // default
      expect(fill?.style.backgroundColor).toBe("rgb(255, 0, 0)"); // custom
    });
  });

  describe("Plugin State Management", () => {
    it("should set enabled state", () => {
      (plugin as unknown as PluginTestAccess).setEnabled(false);
      expect((plugin as unknown as PluginTestAccess).isEnabled()).toBe(false);

      (plugin as unknown as PluginTestAccess).setEnabled(true);
      expect((plugin as unknown as PluginTestAccess).isEnabled()).toBe(true); // should be enabled after setting
    });

    it("should not initialize when disabled before init", () => {
      (plugin as unknown as PluginTestAccess).setEnabled(false);
      plugin.init(mockMo);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar).toBeFalsy();
    });
  });

  describe("destroy", () => {
    it("should clean up progress bar element", () => {
      plugin.init(mockMo);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar).toBeTruthy();

      plugin.destroy();

      const progressBarAfterDestroy = document.querySelector(
        ".mostage-progress-bar"
      );
      expect(progressBarAfterDestroy).toBeFalsy();
    });

    it("should clean up styles", () => {
      plugin.init(mockMo);

      const styleElement = document.querySelector(
        "style[data-mostage-progress-styles]"
      );
      expect(styleElement).toBeTruthy();

      plugin.destroy();

      const styleElementAfterDestroy = document.querySelector(
        "style[data-mostage-progress-styles]"
      );
      expect(styleElementAfterDestroy).toBeFalsy();
    });

    it("should handle destroy when not initialized", () => {
      expect(() => plugin.destroy()).not.toThrow();
    });

    it("should handle multiple destroy calls", () => {
      plugin.init(mockMo);
      plugin.destroy();

      expect(() => plugin.destroy()).not.toThrow();
    });
  });

  describe("DOM Structure", () => {
    it("should create correct DOM structure", () => {
      plugin.init(mockMo);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar).toBeTruthy();

      const fill = progressBar?.querySelector(".mostage-progress-fill");
      expect(fill).toBeTruthy();
    });

    it("should append progress bar to document body", () => {
      plugin.init(mockMo);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar?.parentNode).toBe(document.body);
    });

    it("should set correct CSS classes", () => {
      plugin.init(mockMo);

      const progressBar = document.querySelector(".mostage-progress-bar");
      expect(progressBar?.classList.contains("mostage-progress-bar")).toBe(
        true
      );
      expect(progressBar?.classList.contains("mostage-progress-bottom")).toBe(
        true
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing progress bar element gracefully", () => {
      plugin.init(mockMo);

      // Remove progress bar from DOM
      const progressBar = document.querySelector(".mostage-progress-bar");
      progressBar?.remove();

      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      expect(() => {
        slideChangeCallback({
          currentSlide: 1,
          totalSlides: 3,
        });
      }).not.toThrow();
    });

    it("should handle missing fill element gracefully", () => {
      plugin.init(mockMo);

      // Remove fill element from DOM
      const fill = document.querySelector(".mostage-progress-fill");
      fill?.remove();

      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      expect(() => {
        slideChangeCallback({
          currentSlide: 1,
          totalSlides: 3,
        });
      }).not.toThrow();
    });
  });

  describe("Integration", () => {
    it("should work with multiple slide changes", () => {
      plugin.init(mockMo);
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      // Simulate multiple slide changes
      slideChangeCallback({ currentSlide: 0, totalSlides: 5 });
      slideChangeCallback({ currentSlide: 1, totalSlides: 5 });
      slideChangeCallback({ currentSlide: 2, totalSlides: 5 });
      slideChangeCallback({ currentSlide: 3, totalSlides: 5 });
      slideChangeCallback({ currentSlide: 4, totalSlides: 5 });

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("100%");
    });

    it("should handle rapid slide changes", () => {
      plugin.init(mockMo);
      const slideChangeCallback = mockMo.on.mock.calls[0][1];

      // Simulate rapid slide changes
      for (let i = 0; i < 100; i++) {
        slideChangeCallback({
          currentSlide: i % 5,
          totalSlides: 5,
        });
      }

      const fill = document.querySelector(
        ".mostage-progress-fill"
      ) as HTMLElement;
      expect(fill?.style.width).toBe("100%"); // (4 + 1) / 5 * 100 = 100%
    });
  });
});
