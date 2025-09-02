// Import base styles
import baseStylesCSS from './base.css?raw';

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
    const themeContext = import.meta.glob('../themes/*.css', { 
      eager: true,
      query: '?raw',
      import: 'default'
    });

    // Auto-register all discovered themes
    Object.entries(themeContext).forEach(([path, cssContent]) => {
      // Extract theme name from file path (e.g., '../themes/dark.css' -> 'dark')
      const themeName = path.replace('../themes/', '').replace('.css', '');
      
      this.availableThemes[themeName] = {
        name: themeName,
        cssContent: cssContent as string
      };

      console.debug(`🎨 Discovered theme: ${themeName}`);
    });

    this.initialized = true;
    console.debug(`🎨 Theme loader initialized with ${Object.keys(this.availableThemes).length} themes`);
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
      console.warn(`Theme "${themeName}" not found. Available themes: ${availableThemes.join(', ')}`);
      
      // Try to load the first available theme as fallback
      if (availableThemes.length > 0) {
        return this.loadTheme(availableThemes[0]);
      } else {
        console.error('No themes available!');
        return;
      }
    }

    // Load base styles first if not already loaded
    if (!this.baseStylesLoaded) {
      this.loadBaseStyles();
      this.baseStylesLoaded = true;
    }

    // Remove existing theme styles
    const existingThemeStyles = document.querySelectorAll('style[data-mo-theme]');
    existingThemeStyles.forEach(style => style.remove());

    // Add new theme styles
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-mo-theme', themeName);
    styleElement.textContent = theme.cssContent;
    document.head.appendChild(styleElement);

    console.debug(`🎨 Loaded theme: ${themeName}`);
  }

  /**
   * Load base styles
   */
  private static loadBaseStyles(): void {
    // Check if base styles are already loaded
    if (document.querySelector('style[data-mo-base]')) {
      return;
    }

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-mo-base', 'true');
    styleElement.textContent = baseStylesCSS;
    document.head.appendChild(styleElement);

    console.debug('📐 Loaded base styles');
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
    console.debug(`🎨 Registered custom theme: ${theme.name}`);
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
