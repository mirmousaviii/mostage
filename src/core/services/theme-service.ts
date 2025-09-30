// Import base styles from separate files
import baseStylesCSS from "../styles/foundation/base.css?raw";
import typographyStylesCSS from "../styles/foundation/typography.css?raw";
import centerContentStylesCSS from "../components/ui/center/center.css?raw";
import overviewModeStylesCSS from "../components/ui/overview/overview.css?raw";
import helpStylesCSS from "../components/ui/help/help.css?raw";
import responsiveStylesCSS from "../styles/foundation/responsive.css?raw";
import textContentStylesCSS from "../styles/foundation/text-content.css?raw";
import { Theme } from "../types";

// Combine all base styles into a single string
const combinedBaseStyles = [
  baseStylesCSS,
  typographyStylesCSS,
  centerContentStylesCSS,
  overviewModeStylesCSS,
  helpStylesCSS,
  responsiveStylesCSS,
  textContentStylesCSS,
].join("\n");

/**
 * Enhanced Theme Service with better error handling and management
 * Auto-discovers and manages themes with improved functionality
 */
export class ThemeService {
  private static availableThemes: Record<string, Theme> = {};
  private static baseStylesLoaded = false;
  private static initialized = false;
  private static currentTheme: Theme | null = null;

  /**
   * Ensure themes are initialized
   */
  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * Initialize theme auto-discovery system
   */
  static initialize(): Record<string, Theme> {
    if (this.initialized) return this.availableThemes;

    // Auto-discover all themes from themes directory
    const themeContext = import.meta.glob("../themes/*.css", {
      eager: true,
      query: "?raw",
      import: "default",
    });

    // Auto-register all discovered themes
    Object.entries(themeContext).forEach(([path, cssContent]) => {
      // Extract theme name from file path (e.g., '../themes/dark.css' -> 'dark')
      const themeName = path.replace("../themes/", "").replace(".css", "");

      this.availableThemes[themeName] = {
        name: themeName,
        cssContent: cssContent as string,
      };
    });

    this.initialized = true;
    return this.availableThemes;
  }

  /**
   * Load a theme by name with enhanced error handling
   */
  static async loadTheme(themeName: string): Promise<void> {
    try {
      // Initialize themes if not already done
      this.ensureInitialized();

      const theme = this.availableThemes[themeName];
      if (!theme) {
        const availableThemes = Object.keys(this.availableThemes);

        if (availableThemes.length === 0) {
          throw new ThemeError(
            `No themes available. Theme '${themeName}' not found.`
          );
        }

        // Try to load the first available theme as fallback
        console.warn(
          `Theme '${themeName}' not found. Falling back to '${availableThemes[0]}'`
        );
        return this.loadTheme(availableThemes[0]);
      }

      // Load base styles first if not already loaded
      if (!this.baseStylesLoaded) {
        this.loadBaseStyles();
        this.baseStylesLoaded = true;
      }

      // Remove existing theme styles
      this.removeExistingThemeStyles();

      // Add new theme styles
      this.injectThemeStyles(theme);

      // Update current theme
      this.currentTheme = theme;

      console.log(`Theme '${themeName}' loaded successfully`);
    } catch (error) {
      throw new ThemeLoadError(
        `Failed to load theme '${themeName}': ${error instanceof Error ? error.message : "Unknown error"}`,
        themeName
      );
    }
  }

  /**
   * Switch to a different theme
   */
  static async switchTheme(themeName: string): Promise<void> {
    await this.loadTheme(themeName);
  }

  /**
   * Get the currently loaded theme
   */
  static getCurrentTheme(): Theme | null {
    return this.currentTheme;
  }

  /**
   * Check if a theme is currently loaded
   */
  static isThemeLoaded(themeName: string): boolean {
    return this.currentTheme?.name === themeName;
  }

  /**
   * Get all available themes
   */
  static getAvailableThemes(): Theme[] {
    this.ensureInitialized();
    return Object.values(this.availableThemes);
  }

  /**
   * Remove existing theme styles from DOM
   */
  private static removeExistingThemeStyles(): void {
    const existingThemeStyles = document.querySelectorAll(
      "style[data-mostage-theme]"
    );
    existingThemeStyles.forEach((style) => style.remove());
  }

  /**
   * Inject theme styles into DOM
   */
  private static injectThemeStyles(theme: Theme): void {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-mostage-theme", theme.name);
    styleElement.textContent = theme.cssContent;
    document.head.appendChild(styleElement);
  }

  /**
   * Load base styles
   */
  private static loadBaseStyles(): void {
    // Check if base styles are already loaded
    if (document.querySelector("style[data-mostage-base]")) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-mostage-base", "true");
    styleElement.textContent = combinedBaseStyles;
    document.head.appendChild(styleElement);
  }

  /**
   * Get all available themes as record
   */
  static getAvailableThemesRecord(): Record<string, Theme> {
    this.ensureInitialized();
    return this.availableThemes;
  }

  /**
   * Get list of available theme names
   */
  static getThemeNames(): string[] {
    this.ensureInitialized();
    return Object.keys(this.availableThemes);
  }

  /**
   * Get theme by name
   */
  static getTheme(name: string): Theme | undefined {
    this.ensureInitialized();
    return this.availableThemes[name];
  }

  /**
   * Register a new theme dynamically
   */
  static registerTheme(theme: Theme): void {
    this.ensureInitialized();
    this.availableThemes[theme.name] = theme;
  }

  /**
   * Check if a theme exists
   */
  static hasTheme(name: string): boolean {
    this.ensureInitialized();
    return name in this.availableThemes;
  }
}

/**
 * Custom error classes for theme operations
 */
export class ThemeError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ThemeLoadError extends ThemeError {
  constructor(
    message: string,
    public readonly themeName: string
  ) {
    super(message, "THEME_LOAD_ERROR");
  }
}

export class ThemeNotFoundError extends ThemeError {
  constructor(themeName: string) {
    super(`Theme '${themeName}' not found`, "THEME_NOT_FOUND");
  }
}

// Auto-initialize and export for backward compatibility
export const themes = ThemeService.initialize();
export const loadTheme = ThemeService.loadTheme.bind(ThemeService);
export const getAvailableThemes = ThemeService.getThemeNames.bind(ThemeService);
