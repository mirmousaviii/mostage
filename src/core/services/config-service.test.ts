import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ConfigService,
  ConfigError,
  ConfigLoadError,
  ConfigValidationError,
} from "./config-service";
import { MoConfig } from "../types";

describe("ConfigService", () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    vi.clearAllMocks();
  });

  describe("loadFromFile", () => {
    it("should load configuration from file successfully", async () => {
      const mockConfig = {
        theme: "dark",
        scale: 1.2,
        transition: {
          type: "fade",
          duration: 500,
        },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
      ) as any;

      const result = await configService.loadFromFile("./config.json");
      expect(result.theme).toBe("dark");
      expect(result.scale).toBe(1.2);
      expect(result.transition.type).toBe("fade");
      expect(result.transition.duration).toBe(500);
    });

    it("should throw ConfigLoadError when file is not found", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
      ) as any;

      await expect(
        configService.loadFromFile("./nonexistent.json")
      ).rejects.toThrow(ConfigLoadError);
    });

    it("should throw ConfigLoadError when network error occurs", async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error("Network error"))
      ) as any;

      await expect(configService.loadFromFile("./config.json")).rejects.toThrow(
        ConfigLoadError
      );
    });

    it("should merge loaded config with defaults", async () => {
      const mockConfig = {
        theme: "dark",
        scale: 1.5,
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
      ) as any;

      const result = await configService.loadFromFile("./config.json");
      expect(result.theme).toBe("dark");
      expect(result.scale).toBe(1.5);
      expect(result.loop).toBe(false); // default value
      expect(result.keyboard).toBe(true); // default value
    });
  });

  describe("loadFromURL", () => {
    it("should load configuration from URL successfully", async () => {
      const mockConfig = {
        theme: "ocean",
        plugins: {
          progressBar: { enabled: true },
        },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockConfig),
        })
      ) as any;

      const result = await configService.loadFromURL(
        "https://example.com/config.json"
      );
      expect(result).toEqual(expect.objectContaining(mockConfig));
    });

    it("should throw ConfigLoadError when URL is not accessible", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
      ) as any;

      await expect(
        configService.loadFromURL("https://example.com/config.json")
      ).rejects.toThrow(ConfigLoadError);
    });
  });

  describe("loadFromObject", () => {
    it("should load configuration from object successfully", () => {
      const configObject = {
        theme: "rainbow",
        scale: 0.8,
        loop: true,
      };

      const result = configService.loadFromObject(configObject);
      expect(result.theme).toBe("rainbow");
      expect(result.scale).toBe(0.8);
      expect(result.loop).toBe(true);
    });

    it("should throw ConfigValidationError for invalid object", () => {
      const invalidConfig = {
        theme: 123, // should be string
        scale: "invalid", // should be number
      };

      expect(() => configService.loadFromObject(invalidConfig)).toThrow(
        ConfigValidationError
      );
    });
  });

  describe("validate", () => {
    it("should validate correct configuration", () => {
      const validConfig = {
        theme: "light",
        scale: 1.0,
        transition: {
          type: "horizontal",
          duration: 300,
        },
        plugins: {},
        loop: false,
        keyboard: true,
        touch: true,
        urlHash: false,
      };

      const result = configService.validate(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for invalid configuration", () => {
      const invalidConfig = {
        theme: 123, // should be string
        scale: "invalid", // should be number
        transition: {
          type: "invalid-type", // invalid transition type
          duration: -100, // negative duration
        },
        plugins: "not-an-object", // should be object
        loop: "not-boolean", // should be boolean
        keyboard: "not-boolean", // should be boolean
        touch: "not-boolean", // should be boolean
        urlHash: "not-boolean", // should be boolean
      };

      const result = configService.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle null or undefined config", () => {
      const result = configService.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Configuration must be an object");
    });

    it("should validate transition string format with warning", () => {
      const configWithStringTransition = {
        theme: "light",
        transition: "fade", // legacy string format
      };

      const result = configService.validate(configWithStringTransition);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain(
        "Transition as string is deprecated, use object format"
      );
    });

    it("should validate transition object format", () => {
      const configWithObjectTransition = {
        theme: "light",
        transition: {
          type: "horizontal",
          duration: 300,
          easing: "ease-in-out",
        },
      };

      const result = configService.validate(configWithObjectTransition);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate invalid transition type", () => {
      const configWithInvalidTransition = {
        theme: "light",
        transition: {
          type: "invalid-type",
          duration: 300,
        },
      };

      const result = configService.validate(configWithInvalidTransition);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid transition type");
    });

    it("should validate negative transition duration", () => {
      const configWithNegativeDuration = {
        theme: "light",
        transition: {
          type: "horizontal",
          duration: -100,
        },
      };

      const result = configService.validate(configWithNegativeDuration);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Transition duration must be a non-negative number"
      );
    });
  });

  describe("validateRequired", () => {
    it("should validate all required fields are present", () => {
      const config = {
        theme: "light",
        content: "test content",
        element: "#container",
      };

      const result = configService.validateRequired(config, [
        "theme",
        "content",
        "element",
      ]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for missing required fields", () => {
      const config = {
        theme: "light",
        // missing 'content' and 'element'
      };

      const result = configService.validateRequired(config, [
        "theme",
        "content",
        "element",
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Required field 'content' is missing");
      expect(result.errors).toContain("Required field 'element' is missing");
    });
  });

  describe("validateTypes", () => {
    it("should validate correct field types", () => {
      const config = {
        theme: "light",
        scale: 1.0,
        loop: true,
      };

      const schema = {
        theme: "string",
        scale: "number",
        loop: "boolean",
      };

      const result = configService.validateTypes(config, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return errors for incorrect field types", () => {
      const config = {
        theme: 123,
        scale: "invalid",
        loop: "not-boolean",
      };

      const schema = {
        theme: "string",
        scale: "number",
        loop: "boolean",
      };

      const result = configService.validateTypes(config, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should not validate fields not present in config", () => {
      const config = {
        theme: "light",
        // scale and loop not present
      };

      const schema = {
        theme: "string",
        scale: "number",
        loop: "boolean",
      };

      const result = configService.validateTypes(config, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("getDefaultConfig", () => {
    it("should return default configuration", () => {
      const defaultConfig = configService.getDefaultConfig();

      expect(defaultConfig).toHaveProperty("theme", "light");
      expect(defaultConfig).toHaveProperty("scale", 1.0);
      expect(defaultConfig).toHaveProperty("loop", false);
      expect(defaultConfig).toHaveProperty("keyboard", true);
      expect(defaultConfig).toHaveProperty("touch", true);
      expect(defaultConfig).toHaveProperty("urlHash", false);
      expect(defaultConfig).toHaveProperty("plugins", {});
      expect(defaultConfig).toHaveProperty("transition");
      expect(defaultConfig).toHaveProperty("centerContent");
    });
  });

  describe("Error Classes", () => {
    it("should create ConfigLoadError with correct properties", () => {
      const error = new ConfigLoadError("Test error", "./config.json", 404);

      expect(error.message).toBe("Test error");
      expect(error.path).toBe("./config.json");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("CONFIG_LOAD_ERROR");
      expect(error.name).toBe("ConfigLoadError");
    });

    it("should create ConfigValidationError with correct properties", () => {
      const error = new ConfigValidationError("Validation failed");

      expect(error.message).toBe("Validation failed");
      expect(error.code).toBe("CONFIG_VALIDATION_ERROR");
      expect(error.name).toBe("ConfigValidationError");
    });

    it("should create ConfigError with correct properties", () => {
      const error = new ConfigError("Generic config error", "TEST_CODE");

      expect(error.message).toBe("Generic config error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("ConfigError");
    });
  });

  describe("Deep Merge", () => {
    it("should deep merge nested objects correctly", () => {
      const target = {
        theme: "light",
        transition: {
          type: "horizontal",
          duration: 300,
        },
        plugins: {
          progressBar: { enabled: true },
        },
      };

      const source = {
        theme: "dark",
        transition: {
          type: "fade",
          easing: "ease-in-out",
        },
        plugins: {
          slideNumber: { enabled: false },
        },
        scale: 1.2,
      };

      // Access private method through any type
      const result = (configService as any).deepMerge(target, source);

      expect(result.theme).toBe("dark");
      expect(result.scale).toBe(1.2);
      expect(result.transition.type).toBe("fade");
      expect(result.transition.duration).toBe(300); // from target
      expect(result.transition.easing).toBe("ease-in-out"); // from source
      expect(result.plugins.progressBar.enabled).toBe(true); // from target
      expect(result.plugins.slideNumber.enabled).toBe(false); // from source
    });

    it("should handle arrays correctly in deep merge", () => {
      const target = {
        items: [1, 2, 3],
      };

      const source = {
        items: [4, 5, 6],
      };

      const result = (configService as any).deepMerge(target, source);
      expect(result.items).toEqual([4, 5, 6]); // arrays are replaced, not merged
    });
  });
});
