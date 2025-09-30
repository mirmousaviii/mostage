/**
 * Theme system types for Mostage
 * Defines interfaces and types for the theme architecture
 */

// Base theme interface
export interface Theme {
  name: string;
  cssContent: string;
  version?: string;
  description?: string;
  author?: string;
  preview?: string; // URL to preview image
}

// Theme metadata
export interface ThemeMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  license?: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  preview?: string;
}

// Theme configuration
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  spacing?: string;
}

// Theme registry interface
export interface ThemeRegistry {
  register(theme: Theme): void;
  get(name: string): Theme | undefined;
  getAll(): Record<string, Theme>;
  has(name: string): boolean;
  unregister(name: string): boolean;
  getThemeNames(): string[];
}

// Theme manager interface
export interface ThemeManager {
  loadTheme(name: string): Promise<void>;
  unloadTheme(): void;
  getCurrentTheme(): Theme | null;
  getAvailableThemes(): Theme[];
  switchTheme(name: string): Promise<void>;
  registerTheme(theme: Theme): void;
  isThemeLoaded(name: string): boolean;
}

// Theme loader interface
export interface ThemeLoader {
  loadTheme(themeName: string): Promise<void>;
  getAvailableThemes(): Record<string, Theme>;
  getThemeNames(): string[];
  getTheme(name: string): Theme | undefined;
  registerTheme(theme: Theme): void;
  hasTheme(name: string): boolean;
}

// CSS variable interface for dynamic theming
export interface CSSVariables {
  [key: string]: string;
}

// Theme CSS variables
export interface ThemeVariables {
  "--mostage-primary-color"?: string;
  "--mostage-secondary-color"?: string;
  "--mostage-background-color"?: string;
  "--mostage-text-color"?: string;
  "--mostage-font-family"?: string;
  "--mostage-font-size"?: string;
  "--mostage-border-radius"?: string;
  "--mostage-spacing"?: string;
  "--mostage-shadow"?: string;
  "--mostage-transition"?: string;
  [key: string]: string | undefined;
}

// Theme builder interface
export interface ThemeBuilder {
  setVariable(name: string, value: string): ThemeBuilder;
  setVariables(variables: CSSVariables): ThemeBuilder;
  build(): string;
  reset(): ThemeBuilder;
}

// Theme validator interface
export interface ThemeValidator {
  validate(theme: Theme): ValidationResult;
  validateCSS(css: string): ValidationResult;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
