import { MoConfig, MoPlugin, Slide, MoSlideEvent } from '../types';
import { MarkdownParser } from '../utils/markdown-parser';
import { plugins } from './plugin-loader';
import { loadTheme } from './theme-loader';

export class Mo {
  private config: MoConfig;
  private container: HTMLElement;
  private slides: Slide[] = [];
  private currentSlideIndex = 0;
  private plugins: MoPlugin[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private parser: MarkdownParser;

  constructor(config: MoConfig) {
    this.config = {
      theme: 'light',
      transition: 'horizontal',
      plugins: [],
      autoProgress: false,
      keyboard: true,
      touch: true,
      loop: false,
      speed: 300,
      ...config
    };

    this.parser = new MarkdownParser();
    this.container = this.resolveElement(this.config.element || document.body);
    this.container.classList.add('mo-container');
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
      console.error('Failed to start Mo:', error);
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
    if (!this.config.plugins || this.config.plugins.length === 0) return;

    for (const plugin of this.config.plugins) {
      try {
        let pluginInstance: MoPlugin;

        if (typeof plugin === 'string') {
          const PluginClass = plugins[plugin];
          if (!PluginClass) {
            console.warn(`Plugin "${plugin}" not found. Available plugins: ${Object.keys(plugins).join(', ')}`);
            continue;
          }
          pluginInstance = new PluginClass();
        } else {
          pluginInstance = plugin;
        }

        pluginInstance.init(this);
        this.plugins.push(pluginInstance);
      } catch (error) {
        console.error(`Failed to initialize plugin:`, error);
      }
    }
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
    slidesContainer.className = 'mo-slides';
    
    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement('div');
      slideElement.className = 'mo-slide';
      slideElement.id = slide.id;
      slideElement.innerHTML = slide.html;
      slideElement.style.display = index === 0 ? 'block' : 'none';
      slidesContainer.appendChild(slideElement);
    });
    
    this.container.appendChild(slidesContainer);
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
    const slides = this.container.querySelectorAll('.mo-slide');
    slides.forEach((slide, i) => {
      const slideElement = slide as HTMLElement;
      slideElement.style.display = i === index ? 'block' : 'none';
      slideElement.style.opacity = '1';
      slideElement.style.transform = '';
    });
  }

  private animateTransition(fromIndex: number, toIndex: number): void {
    const slides = this.container.querySelectorAll('.mo-slide');
    const fromSlide = slides[fromIndex] as HTMLElement;
    const toSlide = slides[toIndex] as HTMLElement;

    if (!fromSlide || !toSlide) return;

    if (fromIndex === toIndex) {
      this.showSlide(toIndex);
      return;
    }

    // Apply transition based on config
    switch (this.config.transition) {
      case 'fade':
        this.fadeTransition(fromSlide, toSlide);
        break;
      case 'vertical':
        this.verticalTransition(fromSlide, toSlide, toIndex > fromIndex);
        break;
      case 'horizontal':
      default:
        this.horizontalTransition(fromSlide, toSlide, toIndex > fromIndex);
        break;
    }
  }

  private fadeTransition(fromSlide: HTMLElement, toSlide: HTMLElement): void {
    fromSlide.style.opacity = '0';
    toSlide.style.display = 'block';
    toSlide.style.opacity = '0';
    
    setTimeout(() => {
      toSlide.style.opacity = '1';
      fromSlide.style.display = 'none';
    }, 50);
  }

  private horizontalTransition(fromSlide: HTMLElement, toSlide: HTMLElement, isNext: boolean): void {
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
      }, this.config.speed || 300);
    }, 50);
  }

  private verticalTransition(fromSlide: HTMLElement, toSlide: HTMLElement, isNext: boolean): void {
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
      }, this.config.speed || 300);
    }, 50);
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

  getSlides(): Slide[] {
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
