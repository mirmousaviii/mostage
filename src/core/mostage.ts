import { MoConfig, MoPlugin, MoSlide, MoSlideEvent, TransitionConfig } from '../types';
import { MarkdownParser } from '../utils/markdown-parser';
import { SyntaxHighlighter } from '../utils/syntax-highlighter';
import { plugins } from './plugin-loader';
import { loadTheme } from './theme-loader';

export class Mostage {
  private config: MoConfig;
  private container: HTMLElement;
  private slides: MoSlide[] = [];
  private currentSlideIndex = 0;
  private plugins: MoPlugin[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private parser: MarkdownParser;
  private syntaxHighlighter: SyntaxHighlighter;

  constructor(config: MoConfig) {

    this.config = {
      theme: 'light',
      transition: {
        type: 'horizontal',
        duration: 600,
        easing: 'ease-in-out'
      },
      scale: 1.0,
      loop: false,
      plugins: {},
      keyboard: true,
      touch: true,
      ...config
    };

    // Handle legacy transition format
    if (typeof this.config.transition === 'string') {
      this.config.transition = {
        type: this.config.transition as any,
        duration: 600,
        easing: 'ease-in-out'
      };
    }

    this.parser = new MarkdownParser();
    this.syntaxHighlighter = SyntaxHighlighter.getInstance();
    this.container = this.resolveElement(this.config.element || document.body);
    this.container.classList.add('mostage-container');
    
    // Apply scale if specified
    if (this.config.scale !== 1.0) {
      this.container.style.transform = `scale(${this.config.scale})`;
    }
  }

  async start(): Promise<void> {
    try {
      // Load theme
      if (this.config.theme) {
        await loadTheme(this.config.theme);
      }

      // Load content (either from file or inline)
      if (this.config.content) {
        this.parseMarkdown(this.config.content);
      } else if (this.config.markdown) {
        await this.loadMarkdown(this.config.markdown);
      }

      // Initialize plugins
      this.initializePlugins();

      // Setup navigation
      this.setupNavigation();

      // Render initial slide
      this.renderSlides();
      this.goToSlide(0);

      this.emit('ready', {
        type: 'ready',
        currentSlide: this.currentSlideIndex,
        totalSlides: this.slides.length
      });
    } catch (error) {
      console.error('Failed to start Mostage:', error);
      throw error;
    }
  }

  private resolveElement(element: string | HTMLElement): HTMLElement {
    if (typeof element === 'string') {
      const found = document.querySelector(element) as HTMLElement;
      if (!found) {
        throw new Error(`Element "${element}" not found`);
      }
      return found;
    }
    return element;
  }

  private async loadMarkdown(markdownPath: string): Promise<void> {
    try {
      const response = await fetch(markdownPath);
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.statusText}`);
      }
      const content = await response.text();
      this.parseMarkdown(content);
    } catch (error) {
      console.error('Error loading markdown:', error);
      throw error;
    }
  }

  private parseMarkdown(content: string): void {
    const slideContents = content.split(/^---\s*$/gm).filter(slide => slide.trim());
    
    this.slides = slideContents.map((slideContent, index) => ({
      id: `slide-${index}`,
      content: slideContent.trim(),
      html: this.parser.parse(slideContent.trim())
    }));
  }

  private initializePlugins(): void {
    if (!this.config.plugins) return;

    // Handle configuration-based plugin system only
    Object.entries(this.config.plugins).forEach(([pluginName, pluginConfig]) => {
      try {
        const PluginClass = plugins[pluginName];
        if (!PluginClass) {
          console.warn(`Plugin "${pluginName}" not found. Available plugins: ${Object.keys(plugins).join(', ')}`);
          return;
        }

        const pluginInstance = new PluginClass();
        
        // Use config directly (no active property needed)
        const finalConfig = pluginConfig || {};
        
        pluginInstance.init(this, finalConfig);
        this.plugins.push(pluginInstance);
      } catch (error) {
        console.error(`Failed to initialize plugin "${pluginName}":`, error);
      }
    });
  }

  private setupNavigation(): void {
    if (this.config.keyboard) {
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    if (this.config.touch) {
      this.setupTouchNavigation();
    }
  }

  private handleKeyboard(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
      case ' ':
        event.preventDefault();
        this.nextSlide();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousSlide();
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
    }
  }

  private setupTouchNavigation(): void {
    let startX = 0;
    let startY = 0;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    });
  }

  private renderSlides(): void {
    this.container.innerHTML = '';
    
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'mostage-slides';
    
    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement('div');
      slideElement.className = 'mostage-slide';
      slideElement.id = slide.id;
      slideElement.innerHTML = slide.html;
      slideElement.style.display = index === 0 ? 'block' : 'none';
      slidesContainer.appendChild(slideElement);
    });
    
    this.container.appendChild(slidesContainer);
    
    // Apply syntax highlighting to all slides after rendering
    this.syntaxHighlighter.highlightAll(this.container);
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    } else if (this.config.loop) {
      this.goToSlide(0);
    }
  }

  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    } else if (this.config.loop) {
      this.goToSlide(this.slides.length - 1);
    }
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;

    const previousIndex = this.currentSlideIndex;
    this.currentSlideIndex = index;

    if (previousIndex === index) {
      this.showSlide(index);
    } else {
      this.animateTransition(previousIndex, index);
    }

    this.emit('slidechange', {
      type: 'slidechange',
      currentSlide: index,
      totalSlides: this.slides.length,
      slide: this.slides[index]
    });
  }

  private showSlide(index: number): void {
    const slides = this.container.querySelectorAll('.mostage-slide');
    slides.forEach((slide, i) => {
      const slideElement = slide as HTMLElement;
      slideElement.style.display = i === index ? 'block' : 'none';
      slideElement.style.opacity = '1';
      slideElement.style.transform = '';
    });
  }

  private animateTransition(fromIndex: number, toIndex: number): void {
    const slides = this.container.querySelectorAll('.mostage-slide');
    const fromSlide = slides[fromIndex] as HTMLElement;
    const toSlide = slides[toIndex] as HTMLElement;

    if (!fromSlide || !toSlide) return;

    if (fromIndex === toIndex) {
      this.showSlide(toIndex);
      return;
    }

    const transition = this.config.transition as TransitionConfig;
    const duration = transition.duration || 600;

    // Set transition properties
    fromSlide.style.transition = `all ${duration}ms ${transition.easing || 'ease-in-out'}`;
    toSlide.style.transition = `all ${duration}ms ${transition.easing || 'ease-in-out'}`;

    // Apply transition based on config
    switch (transition.type) {
      case 'fade':
        this.fadeTransition(fromSlide, toSlide, duration);
        break;
      case 'vertical':
        this.verticalTransition(fromSlide, toSlide, toIndex > fromIndex, duration);
        break;
      case 'slide':
        this.slideTransition(fromSlide, toSlide, toIndex > fromIndex, duration);
        break;
      case 'horizontal':
      default:
        this.horizontalTransition(fromSlide, toSlide, toIndex > fromIndex, duration);
        break;
    }
  }

  private fadeTransition(fromSlide: HTMLElement, toSlide: HTMLElement, duration: number): void {
    fromSlide.style.opacity = '0';
    toSlide.style.display = 'block';
    toSlide.style.opacity = '0';
    
    setTimeout(() => {
      toSlide.style.opacity = '1';
      setTimeout(() => {
        fromSlide.style.display = 'none';
        fromSlide.style.opacity = '1';
      }, duration);
    }, 50);
  }

  private horizontalTransition(fromSlide: HTMLElement, toSlide: HTMLElement, isNext: boolean, duration: number): void {
    const direction = isNext ? 'translateX(-100%)' : 'translateX(100%)';
    const enterDirection = isNext ? 'translateX(100%)' : 'translateX(-100%)';
    
    toSlide.style.display = 'block';
    toSlide.style.transform = enterDirection;
    
    setTimeout(() => {
      fromSlide.style.transform = direction;
      toSlide.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        fromSlide.style.display = 'none';
        fromSlide.style.transform = '';
        toSlide.style.transform = '';
      }, duration);
    }, 50);
  }

  private verticalTransition(fromSlide: HTMLElement, toSlide: HTMLElement, isNext: boolean, duration: number): void {
    const direction = isNext ? 'translateY(-100%)' : 'translateY(100%)';
    const enterDirection = isNext ? 'translateY(100%)' : 'translateY(-100%)';
    
    toSlide.style.display = 'block';
    toSlide.style.transform = enterDirection;
    
    setTimeout(() => {
      fromSlide.style.transform = direction;
      toSlide.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        fromSlide.style.display = 'none';
        fromSlide.style.transform = '';
        toSlide.style.transform = '';
      }, duration);
    }, 50);
  }

  private slideTransition(fromSlide: HTMLElement, toSlide: HTMLElement, isNext: boolean, duration: number): void {
    // Similar to horizontal but with different easing
    this.horizontalTransition(fromSlide, toSlide, isNext, duration);
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  emit(event: string, data: MoSlideEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Getters for plugins
  getCurrentSlide(): number {
    return this.currentSlideIndex;
  }

  getTotalSlides(): number {
    return this.slides.length;
  }

  getSlides(): MoSlide[] {
    return this.slides;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  // Cleanup
  destroy(): void {
    this.plugins.forEach(plugin => {
      try {
        if (plugin.destroy) {
          plugin.destroy();
        }
      } catch (error) {
        console.error(`Failed to destroy plugin: ${plugin.name}`, error);
      }
    });
    this.plugins = [];
    this.eventListeners.clear();
  }
}
