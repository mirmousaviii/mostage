/**
 * Core types for the Mostage presentation framework
 * Centralized type definitions for better maintainability
 */

// Base plugin interface
export interface MoPlugin {
  name: string;
  init: (mo: MostageInstance, config?: unknown) => void;
  destroy?: () => void;
  setEnabled?: (enabled: boolean) => void;
  isEnabled?: () => boolean;
}

// Slide interface
export interface MoSlide {
  id: string;
  content: string;
  html: string;
  notes?: string;
  background?: string;
  transition?: string;
}

// Slide event interface
export interface MoSlideEvent {
  type: string;
  currentSlide: number;
  totalSlides: number;
  slide?: MoSlide;
}

// Theme interface
export interface MoTheme {
  name: string;
  css: string;
}

// Center content configuration
export interface CenterContentConfig {
  vertical?: boolean;
  horizontal?: boolean;
}

// Header configuration
export interface HeaderConfig {
  content?: string;
  contentPath?: string;
  position?: "top-left" | "top-center" | "top-right";
  showOnFirstSlide?: boolean;
}

// Footer configuration
export interface FooterConfig {
  content?: string;
  contentPath?: string;
  position?: "bottom-left" | "bottom-center" | "bottom-right";
  showOnFirstSlide?: boolean;
}

// Background configuration
export interface BackgroundConfig {
  imagePath?: string;
  size?: "cover" | "contain" | "auto" | string;
  position?: "center" | "top" | "bottom" | "left" | "right" | string;
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  bgColor?: string;
  global?: boolean;
  allSlides?: number[];
  allSlidesExcept?: number[];
}

// Background item (for array configurations)
export interface BackgroundItem {
  imagePath?: string;
  size?: "cover" | "contain" | "auto" | string;
  position?: "center" | "top" | "bottom" | "left" | "right" | string;
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  bgColor?: string;
  global?: boolean;
  allSlides?: number[];
  allSlidesExcept?: number[];
}

// Transition configuration
export interface TransitionConfig {
  type?: "horizontal" | "vertical" | "fade" | "slide";
  duration?: number;
  easing?: string;
}

// Plugins configuration
export interface PluginsConfig {
  [key: string]: any;
}

// Main configuration interface
export interface MoConfig {
  element?: string | HTMLElement;
  theme?: string;
  // Content loading configuration
  contentPath?: string; // File path or URL for content
  content?: string; // Inline content data
  configPath?: string; // Path to configuration file
  scale?: number;
  transition?: TransitionConfig;
  loop?: boolean;
  plugins?: PluginsConfig;
  keyboard?: boolean;
  touch?: boolean;
  urlHash?: boolean; // Enable URL hash navigation
  centerContent?: CenterContentConfig; // Built-in content centering
  header?: HeaderConfig; // Header configuration
  footer?: FooterConfig; // Footer configuration
  background?: BackgroundConfig | BackgroundItem[]; // Background configuration (single or array)
}

// Mostage instance interface (for plugins)
export interface MostageInstance {
  getCurrentSlide(): number;
  getTotalSlides(): number;
  getSlides(): MoSlide[];
  getContainer(): HTMLElement;
  goToSlide(index: number): void;
  nextSlide(): void;
  previousSlide(): void;
  toggleOverview(): void;
  on(event: string, callback: Function): void;
  emit(event: string, data: MoSlideEvent): void;
}

// Service interfaces
export interface ContentService {
  loadContentFromSource(sourcePath: string): Promise<string>;
  parseContent(content: string): MoSlide[];
  parseMarkdownToHtml(content: string): string;
}

export interface ThemeService {
  loadTheme(themeName: string): Promise<void>;
  getAvailableThemes(): Record<string, MoTheme>;
  getThemeNames(): string[];
  getTheme(name: string): MoTheme | undefined;
  registerTheme(theme: MoTheme): void;
  hasTheme(name: string): boolean;
}

export interface PluginService {
  getPlugins(): Record<string, new () => MoPlugin>;
  getPlugin(name: string): (new () => MoPlugin) | undefined;
  getAvailablePlugins(): string[];
}

// Navigation interfaces
export interface NavigationService {
  setSlides(slides: MoSlide[]): void;
  setCurrentSlideIndex(index: number): void;
  setupNavigation(): void;
}

// Event system interfaces
export interface EventEmitter {
  on(event: string, callback: Function): void;
  emit(event: string, data: MoSlideEvent): void;
}

// Component interfaces
export interface Component {
  init(): void;
  destroy(): void;
}

export interface NavigationComponent extends Component {
  setSlides(slides: MoSlide[]): void;
  setCurrentSlideIndex(index: number): void;
}

export interface UIComponent extends Component {
  show(): void;
  hide(): void;
  toggle(): void;
}

// Test-specific types for accessing private properties
export interface MostageTestAccess {
  config: MoConfig;
  overviewManager: {
    toggleOverview: () => void;
  };
}

// Plugin test access interface
export interface PluginTestAccess {
  setEnabled: (enabled: boolean) => void;
  isEnabled: () => boolean;
  style?: CSSStyleDeclaration;
}
