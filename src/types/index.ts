export interface MoPlugin {
  name: string;
  init: (mo: any, config?: any) => void;
  destroy?: () => void;
  setEnabled?: (enabled: boolean) => void;
}

// Plugin Configuration Interfaces
export interface ProgressBarConfig {
  enabled?: boolean;
  position?: "top" | "bottom";
  color?: string;
  height?: string;
}

export interface SlideNumberConfig {
  enabled?: boolean;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  format?: string;
}

export interface ControllerConfig {
  enabled?: boolean;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export interface ConfettiConfig {
  enabled?: boolean;
  particleCount?: number;
  colors?: string[];
  size?: {
    min?: number;
    max?: number;
  };
  duration?: number;
  delay?: number;
}

export interface CenterContentConfig {
  vertical?: boolean;
  horizontal?: boolean;
}

export interface PluginsConfig {
  ProgressBar?: ProgressBarConfig;
  SlideNumber?: SlideNumberConfig;
  Controller?: ControllerConfig;
  Confetti?: ConfettiConfig;
}

export interface TransitionConfig {
  type?: "horizontal" | "vertical" | "fade" | "slide";
  duration?: number;
  easing?: string;
}

export interface MoConfig {
  element?: string | HTMLElement;
  theme?: string;
  // Content loading configuration
  contentPath?: string; // File path or URL for content
  content?: string; // Inline content data
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
