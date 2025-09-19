export interface MoPlugin {
  name: string;
  init: (mo: any, config?: any) => void;
  destroy?: () => void;
}

// Plugin Configuration Interfaces
export interface ProgressBarConfig {
  position?: "top" | "bottom";
  color?: string;
  height?: string;
}

export interface SlideNumberConfig {
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  format?: string;
}

export interface ControllerConfig {
  show?: boolean;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export interface OverviewModeConfig {
  scale?: number;
}

export interface CenterContentConfig {
  vertical?: boolean;
  horizontal?: boolean;
}

export interface PluginsConfig {
  ProgressBar?: ProgressBarConfig;
  SlideNumber?: SlideNumberConfig;
  Controller?: ControllerConfig;
  OverviewMode?: OverviewModeConfig;
  Confetti?: boolean;
}

export interface TransitionConfig {
  type?: "horizontal" | "vertical" | "fade" | "slide";
  duration?: number;
  easing?: string;
}

// Content type specification
export type ContentType = "markdown" | "html" | "text";

export interface MoConfig {
  element?: string | HTMLElement;
  theme?: string;
  // Content loading configuration
  contentSource?: string; // File path or URL for content
  contentData?: string; // Inline content data
  contentType?: ContentType; // Type of content (default: "markdown")
  scale?: number;
  transition?: TransitionConfig;
  loop?: boolean;
  plugins?: PluginsConfig;
  keyboard?: boolean;
  touch?: boolean;
  urlHash?: boolean; // Enable URL hash navigation
  centerContent?: CenterContentConfig; // Built-in content centering
}

export interface MoSlide {
  id: string;
  content: string;
  html: string;
  notes?: string;
  background?: string;
  transition?: string;
}

export interface MoSlideEvent {
  type: string;
  currentSlide: number;
  totalSlides: number;
  slide?: MoSlide;
}

export interface MoTheme {
  name: string;
  css: string;
}
