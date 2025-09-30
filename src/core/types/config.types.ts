/**
 * Configuration types for Mostage
 * Defines interfaces and types for configuration management
 */

// Configuration validation result
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Configuration validator interface
export interface ConfigValidator {
  validate(config: any): ConfigValidationResult;
  validateRequired(config: any, required: string[]): ConfigValidationResult;
  validateTypes(
    config: any,
    schema: Record<string, string>
  ): ConfigValidationResult;
}

// Configuration loader interface
export interface ConfigLoader {
  loadFromFile(path: string): Promise<any>;
  loadFromURL(url: string): Promise<any>;
  loadFromObject(obj: any): any;
  validate(config: any): ConfigValidationResult;
}

// Configuration builder interface
export interface ConfigBuilder {
  setTheme(theme: string): ConfigBuilder;
  setPlugins(plugins: Record<string, any>): ConfigBuilder;
  setTransition(transition: any): ConfigBuilder;
  setContent(content: string): ConfigBuilder;
  setContentPath(path: string): ConfigBuilder;
  build(): any;
  reset(): ConfigBuilder;
}

// Environment configuration
export interface EnvironmentConfig {
  development: any;
  production: any;
  test: any;
}

// Configuration schema
export interface ConfigSchema {
  [key: string]: {
    type: string;
    required?: boolean;
    default?: any;
    validator?: (value: any) => boolean;
    description?: string;
  };
}

// Configuration options for CLI
export interface ConfigOptions {
  template?: string;
  contentPath?: string;
  configPath?: string;
  theme?: string;
  plugins?: string;
  transition?: string;
  urlHash?: boolean;
  center?: boolean;
  config?: boolean;
  content?: boolean;
}

// Project configuration
export interface ProjectConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  homepage?: string;
  keywords?: string[];
}

// Build configuration
export interface BuildConfig {
  output: string;
  minify: boolean;
  sourcemap: boolean;
  assets: string[];
  exclude: string[];
}

// Development configuration
export interface DevConfig {
  port: number;
  host: string;
  open: boolean;
  cors: boolean;
  https: boolean;
  proxy?: Record<string, string>;
}
