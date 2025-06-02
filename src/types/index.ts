export interface MoPlugin {
  name: string;
  init: (mo: any) => void;
  destroy?: () => void;
}

export interface MoConfig {
  element?: string | HTMLElement;
  theme?: string;
  markdown?: string;
  content?: string;
  transition?: 'horizontal' | 'vertical' | 'fade' | 'slide-in' | 'slide-out';
  plugins?: string[] | MoPlugin[];
  autoProgress?: boolean;
  keyboard?: boolean;
  touch?: boolean;
  loop?: boolean;
  speed?: number;
}

export interface Slide {
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
  slide?: Slide;
}

export interface MoTheme {
  name: string;
  css: string;
}

export { Mo } from '../mo';
export { MarkdownParser } from '../parser/markdown';
export * from '../plugins';
export * from '../themes';
