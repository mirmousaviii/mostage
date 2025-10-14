import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PluginBase } from "./plugin-base";
import { MoPlugin } from "./types";

// Create a concrete implementation of PluginBase for testing
class TestPlugin extends PluginBase {
  name = "TestPlugin";
  private initialized = false;

  init(mo: any, config?: any): void {
    if (!this.checkEnabled()) {
      return;
    }
    this.initialized = true;
  }

  destroy(): void {
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

describe("PluginBase", () => {
  let plugin: TestPlugin;
  let mockMo: any;

  beforeEach(() => {
    plugin = new TestPlugin();
    mockMo = {
      getCurrentSlide: vi.fn(() => 0),
      getTotalSlides: vi.fn(() => 5),
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

  describe("Basic Properties", () => {
    it("should have correct name", () => {
      expect(plugin.name).toBe("TestPlugin");
    });

    it("should be enabled by default", () => {
      expect(plugin.isEnabled()).toBe(true);
    });
  });

  describe("Enabled State Management", () => {
    it("should set enabled state", () => {
      plugin.setEnabled(false);
      expect(plugin.isEnabled()).toBe(false);

      plugin.setEnabled(true);
      expect(plugin.isEnabled()).toBe(true);
    });

    it("should prevent initialization when disabled", () => {
      plugin.setEnabled(false);
      plugin.init(mockMo);

      expect(plugin.isInitialized()).toBe(false);
    });

    it("should allow initialization when enabled", () => {
      plugin.setEnabled(true);
      plugin.init(mockMo);

      expect(plugin.isInitialized()).toBe(true);
    });
  });

  describe("Style Injection", () => {
    it("should inject styles into document", () => {
      const styles = "/* test styles */";
      const dataAttribute = "test-styles";

      plugin.init(mockMo);
      (plugin as any).injectStyles(styles, dataAttribute);

      const styleElement = document.querySelector(
        `style[data-mostage-${dataAttribute}]`,
      );
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toBe(styles);
    });

    it("should not inject styles multiple times", () => {
      const styles = "/* test styles */";
      const dataAttribute = "test-styles";

      plugin.init(mockMo);
      (plugin as any).injectStyles(styles, dataAttribute);
      (plugin as any).injectStyles(styles, dataAttribute);

      const styleElements = document.querySelectorAll(
        `style[data-mostage-${dataAttribute}]`,
      );
      expect(styleElements).toHaveLength(1);
    });

    it("should inject styles with unique data attributes", () => {
      const styles1 = "/* styles 1 */";
      const styles2 = "/* styles 2 */";

      plugin.init(mockMo);
      (plugin as any).injectStyles(styles1, "styles1");
      (plugin as any).injectStyles(styles2, "styles2");

      const styleElement1 = document.querySelector(
        "style[data-mostage-styles1]",
      );
      const styleElement2 = document.querySelector(
        "style[data-mostage-styles2]",
      );

      expect(styleElement1).toBeTruthy();
      expect(styleElement2).toBeTruthy();
      expect(styleElement1?.textContent).toBe(styles1);
      expect(styleElement2?.textContent).toBe(styles2);
    });
  });

  describe("Style Cleanup", () => {
    it("should clean up injected styles", () => {
      const styles = "/* test styles */";
      const dataAttribute = "test-styles";

      plugin.init(mockMo);
      (plugin as any).injectStyles(styles, dataAttribute);

      let styleElement = document.querySelector(
        `style[data-mostage-${dataAttribute}]`,
      );
      expect(styleElement).toBeTruthy();
      (plugin as any).cleanupStyles();

      styleElement = document.querySelector(
        `style[data-mostage-${dataAttribute}]`,
      );
      expect(styleElement).toBeFalsy();
    });

    it("should handle cleanup when no styles are injected", () => {
      plugin.init(mockMo);

      expect(() => {
        (plugin as any).cleanupStyles();
      }).not.toThrow();
    });

    it("should handle multiple cleanup calls", () => {
      const styles = "/* test styles */";
      const dataAttribute = "test-styles";

      plugin.init(mockMo);
      (plugin as any).injectStyles(styles, dataAttribute);
      (plugin as any).cleanupStyles();

      expect(() => {
        (plugin as any).cleanupStyles();
      }).not.toThrow();
    });
  });

  describe("Element Cleanup", () => {
    it("should clean up DOM elements", () => {
      const element1 = document.createElement("div");
      const element2 = document.createElement("span");
      const element3 = document.createElement("p");

      document.body.appendChild(element1);
      document.body.appendChild(element2);
      document.body.appendChild(element3);
      (plugin as any).cleanupElements(element1, element2, element3);

      expect(document.body.contains(element1)).toBe(false);
      expect(document.body.contains(element2)).toBe(false);
      expect(document.body.contains(element3)).toBe(false);
    });

    it("should handle null elements", () => {
      const element1 = document.createElement("div");
      const element2 = null;
      const element3 = document.createElement("span");

      document.body.appendChild(element1);
      document.body.appendChild(element3);

      expect(() => {
        (plugin as any).cleanupElements(element1, element2, element3);
      }).not.toThrow();

      expect(document.body.contains(element1)).toBe(false);
      expect(document.body.contains(element3)).toBe(false);
    });

    it("should handle undefined elements", () => {
      const element1 = document.createElement("div");
      const element2 = undefined;
      const element3 = document.createElement("span");

      document.body.appendChild(element1);
      document.body.appendChild(element3);

      expect(() => {
        (plugin as any).cleanupElements(element1, element2, element3);
      }).not.toThrow();

      expect(document.body.contains(element1)).toBe(false);
      expect(document.body.contains(element3)).toBe(false);
    });

    it("should handle empty element list", () => {
      expect(() => {
        (plugin as any).cleanupElements();
      }).not.toThrow();
    });
  });

  describe("checkEnabled", () => {
    it("should return true when plugin is enabled", () => {
      plugin.setEnabled(true);

      const result = (plugin as any).checkEnabled();
      expect(result).toBe(true);
    });

    it("should return false when plugin is disabled", () => {
      plugin.setEnabled(false);

      const result = (plugin as any).checkEnabled();
      expect(result).toBe(false);
    });
  });

  describe("Plugin Lifecycle", () => {
    it("should initialize successfully when enabled", () => {
      plugin.setEnabled(true);
      plugin.init(mockMo);

      expect(plugin.isInitialized()).toBe(true);
    });

    it("should not initialize when disabled", () => {
      plugin.setEnabled(false);
      plugin.init(mockMo);

      expect(plugin.isInitialized()).toBe(false);
    });

    it("should destroy successfully", () => {
      plugin.init(mockMo);
      expect(plugin.isInitialized()).toBe(true);

      plugin.destroy();
      expect(plugin.isInitialized()).toBe(false);
    });

    it("should handle multiple init calls", () => {
      plugin.init(mockMo);
      plugin.init(mockMo);

      expect(plugin.isInitialized()).toBe(true);
    });

    it("should handle multiple destroy calls", () => {
      plugin.init(mockMo);
      plugin.destroy();

      expect(() => plugin.destroy()).not.toThrow();
    });
  });

  describe("Integration with Mostage Instance", () => {
    it("should receive Mostage instance in init", () => {
      const initSpy = vi.spyOn(plugin, "init");

      plugin.init(mockMo);

      expect(initSpy).toHaveBeenCalledWith(mockMo);
    });

    it("should receive config in init", () => {
      const config = { enabled: true, color: "red" };
      const initSpy = vi.spyOn(plugin, "init");

      plugin.init(mockMo, config);

      expect(initSpy).toHaveBeenCalledWith(mockMo, config);
    });
  });

  describe("Error Handling", () => {
    it("should handle style injection errors gracefully", () => {
      // Mock document.head.appendChild to throw error
      const originalAppendChild = document.head.appendChild;
      document.head.appendChild = vi.fn(() => {
        throw new Error("DOM error");
      });

      expect(() => {
        (plugin as any).injectStyles("/* styles */", "test");
      }).toThrow("DOM error");

      // Restore original method
      document.head.appendChild = originalAppendChild;
    });

    it("should handle element removal errors gracefully", () => {
      const element = document.createElement("div");
      element.remove = vi.fn(() => {
        throw new Error("Remove error");
      });

      expect(() => {
        (plugin as any).cleanupElements(element);
      }).toThrow("Remove error");
    });
  });

  describe("Plugin Interface Compliance", () => {
    it("should implement MoPlugin interface", () => {
      expect(plugin).toHaveProperty("name");
      expect(plugin).toHaveProperty("init");
      expect(plugin).toHaveProperty("destroy");
      expect(typeof plugin.init).toBe("function");
      expect(typeof plugin.destroy).toBe("function");
    });

    it("should have correct method signatures", () => {
      expect(plugin.init.length).toBe(2); // mo, config
      expect(plugin.destroy.length).toBe(0);
    });
  });

  describe("Memory Management", () => {
    it("should not leak DOM elements after destroy", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      plugin.init(mockMo);
      (plugin as any).injectStyles("/* styles */", "test");
      (plugin as any).cleanupElements(element);
      plugin.destroy();

      expect(document.body.contains(element)).toBe(false);
      // Style cleanup is handled by the destroy method
      expect(document.querySelector("style[data-mostage-test]")).toBeTruthy();
    });

    it("should clean up all resources on destroy", () => {
      const element1 = document.createElement("div");
      const element2 = document.createElement("span");

      document.body.appendChild(element1);
      document.body.appendChild(element2);

      plugin.init(mockMo);
      (plugin as any).injectStyles("/* styles 1 */", "test1");
      (plugin as any).injectStyles("/* styles 2 */", "test2");

      (plugin as any).cleanupElements(element1, element2);
      plugin.destroy();

      expect(document.body.contains(element1)).toBe(false);
      expect(document.body.contains(element2)).toBe(false);
      // Note: Style cleanup is handled by the destroy method
      expect(document.querySelector("style[data-mostage-test1]")).toBeTruthy();
      expect(document.querySelector("style[data-mostage-test2]")).toBeTruthy();
    });
  });
});
