/**
 * Configuration Service for Mostage
 * Provides centralized configuration management with validation
 */

import {
  MoConfig,
  ConfigLoader,
  ConfigValidator,
  ConfigValidationResult,
} from "@/types";

/**
 * Enhanced Configuration Service
 * Manages configuration loading, validation, and merging
 */
export class ConfigService implements ConfigLoader, ConfigValidator {
  private static defaultConfig: Partial<MoConfig> = {
    theme: "light",
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
  };

  /**
   * Load configuration from file
   */
  async loadFromFile(path: string): Promise<MoConfig> {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new ConfigLoadError(
          `Failed to load config from ${path}: ${response.status} ${response.statusText}`,
          path,
          response.status
        );
      }

      const configData = await response.json();
      return this.validateAndMerge(configData);
    } catch (error) {
      if (error instanceof ConfigLoadError) {
        throw error;
      }

      throw new ConfigLoadError(
        `Error loading config from ${path}: ${error instanceof Error ? error.message : "Unknown error"}`,
        path
      );
    }
  }

  /**
   * Load configuration from URL
   */
  async loadFromURL(url: string): Promise<MoConfig> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new ConfigLoadError(
          `Failed to load config from ${url}: ${response.status} ${response.statusText}`,
          url,
          response.status
        );
      }

      const configData = await response.json();
      return this.validateAndMerge(configData);
    } catch (error) {
      if (error instanceof ConfigLoadError) {
        throw error;
      }

      throw new ConfigLoadError(
        `Error loading config from ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
        url
      );
    }
  }

  /**
   * Load configuration from object
   */
  loadFromObject(obj: any): MoConfig {
    try {
      return this.validateAndMerge(obj);
    } catch (error) {
      throw new ConfigValidationError(
        `Invalid configuration object: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Validate configuration
   */
  validate(config: any): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if config is an object
    if (!config || typeof config !== "object") {
      errors.push("Configuration must be an object");
      return { isValid: false, errors, warnings };
    }

    // Validate theme
    if (config.theme && typeof config.theme !== "string") {
      errors.push("Theme must be a string");
    }

    // Validate scale
    if (config.scale !== undefined) {
      if (typeof config.scale !== "number" || config.scale <= 0) {
        errors.push("Scale must be a positive number");
      }
    }

    // Validate transition
    if (config.transition) {
      if (typeof config.transition === "string") {
        // Legacy format - convert to object
        warnings.push("Transition as string is deprecated, use object format");
      } else if (typeof config.transition === "object") {
        if (
          config.transition.type &&
          !["horizontal", "vertical", "fade", "slide"].includes(
            config.transition.type
          )
        ) {
          errors.push("Invalid transition type");
        }
        if (
          config.transition.duration &&
          (typeof config.transition.duration !== "number" ||
            config.transition.duration < 0)
        ) {
          errors.push("Transition duration must be a non-negative number");
        }
      }
    }

    // Validate plugins
    if (config.plugins && typeof config.plugins !== "object") {
      errors.push("Plugins must be an object");
    }

    // Validate boolean properties
    const booleanProps = ["loop", "keyboard", "touch", "urlHash"];
    booleanProps.forEach((prop) => {
      if (config[prop] !== undefined && typeof config[prop] !== "boolean") {
        errors.push(`${prop} must be a boolean`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate required fields
   */
  validateRequired(config: any, required: string[]): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    required.forEach((field) => {
      if (!(field in config)) {
        errors.push(`Required field '${field}' is missing`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate field types
   */
  validateTypes(
    config: any,
    schema: Record<string, string>
  ): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(schema).forEach(([field, expectedType]) => {
      if (field in config) {
        const actualType = typeof config[field];
        if (actualType !== expectedType) {
          errors.push(
            `Field '${field}' must be of type ${expectedType}, got ${actualType}`
          );
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): Partial<MoConfig> {
    return { ...ConfigService.defaultConfig };
  }

  /**
   * Merge configuration with defaults
   */
  private validateAndMerge(config: any): MoConfig {
    const validation = this.validate(config);

    if (!validation.isValid) {
      throw new ConfigValidationError(
        `Configuration validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn("Configuration warnings:", validation.warnings);
    }

    // Merge with defaults
    return this.deepMerge(ConfigService.defaultConfig, config) as MoConfig;
  }

  /**
   * Deep merge objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }
}

/**
 * Custom error classes for configuration operations
 */
export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConfigLoadError extends ConfigError {
  constructor(
    message: string,
    public readonly path: string,
    public readonly statusCode?: number
  ) {
    super(message, "CONFIG_LOAD_ERROR");
  }
}

export class ConfigValidationError extends ConfigError {
  constructor(message: string) {
    super(message, "CONFIG_VALIDATION_ERROR");
  }
}
