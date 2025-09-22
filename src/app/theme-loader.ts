// Import base styles from separate files
import baseStylesCSS from "./foundation-styles/base.css?raw";
import typographyStylesCSS from "./foundation-styles/typography.css?raw";
import centerContentStylesCSS from "./ui/center/center.css?raw";
import overviewModeStylesCSS from "./ui/overview/overview.css?raw";
import responsiveStylesCSS from "./foundation-styles/responsive.css?raw";
import textContentStylesCSS from "./foundation-styles/text-content.css?raw";

// Combine all base styles
const combinedBaseStyles = [
  baseStylesCSS,
  typographyStylesCSS,
  centerContentStylesCSS,
  overviewModeStylesCSS,
  responsiveStylesCSS,
  textContentStylesCSS,
].join("\n");

export interface Theme {
  name: string;
  cssContent: string;
}

/**
 * Theme Loader - Auto-discovers and manages themes
 */
export class ThemeLoader {
  private static availableThemes: Record<string, Theme> = {};
  private static baseStylesLoaded = false;
  private static initialized = false;

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
   * Load a theme by name
   */
  static async loadTheme(themeName: string): Promise<void> {
    // Initialize themes if not already done
    if (!this.initialized) {
      this.initialize();
    }

    const theme = this.availableThemes[themeName];
    if (!theme) {
      const availableThemes = Object.keys(this.availableThemes);
      console.warn(
        `Theme "${themeName}" not found. Available themes: ${availableThemes.join(", ")}`
      );

      // Try to load the first available theme as fallback
      if (availableThemes.length > 0) {
        return this.loadTheme(availableThemes[0]);
      } else {
        console.error("No themes available!");
        return;
      }
    }

    // Load base styles first if not already loaded
    if (!this.baseStylesLoaded) {
      this.loadBaseStyles();
      this.baseStylesLoaded = true;
    }

    // Remove existing theme styles
    const existingThemeStyles = document.querySelectorAll(
      "style[data-mostage-theme]"
    );
    existingThemeStyles.forEach((style) => style.remove());

    // Add new theme styles
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-mostage-theme", themeName);
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
   * Get all available themes
   */
  static getAvailableThemes(): Record<string, Theme> {
    if (!this.initialized) {
      this.initialize();
    }
    return this.availableThemes;
  }

  /**
   * Get list of available theme names
   */
  static getThemeNames(): string[] {
    return Object.keys(this.getAvailableThemes());
  }

  /**
   * Get theme by name
   */
  static getTheme(name: string): Theme | undefined {
    if (!this.initialized) {
      this.initialize();
    }
    return this.availableThemes[name];
  }

  /**
   * Register a new theme dynamically
   */
  static registerTheme(theme: Theme): void {
    if (!this.initialized) {
      this.initialize();
    }

    this.availableThemes[theme.name] = theme;
  }

  /**
   * Check if a theme exists
   */
  static hasTheme(name: string): boolean {
    if (!this.initialized) {
      this.initialize();
    }
    return name in this.availableThemes;
  }
}

// Auto-initialize and export for backward compatibility
export const themes = ThemeLoader.initialize();
export const loadTheme = ThemeLoader.loadTheme.bind(ThemeLoader);
export const getAvailableThemes = ThemeLoader.getThemeNames.bind(ThemeLoader);
