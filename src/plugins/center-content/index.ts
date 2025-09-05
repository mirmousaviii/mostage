import { MoPlugin, CenterContentConfig } from '../../types';
import styles from './style.css?inline';

export class CenterContentPlugin implements MoPlugin {
  name = 'CenterContent';
  private styleElement: HTMLElement | null = null;
  private config!: CenterContentConfig;

  init(mo: any, config: CenterContentConfig = {}): void {
    this.config = {
      vertical: true,
      horizontal: true,
      ...config
    };

    this.injectStyles();
    this.setupSlideObserver();
    
    setTimeout(() => this.updateCurrentSlide(), 100);
    
    mo.on('slidechange', () => {
      setTimeout(() => this.updateCurrentSlide(), 50);
    });
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-center-content-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-center-content-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private setupSlideObserver(): void {
    const observer = new MutationObserver(() => {
      this.updateCurrentSlide();
    });

    const container = document.querySelector('.mostage-container');
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }

  private updateCurrentSlide(): void {
    const slides = document.querySelectorAll('.mostage-slide');
    slides.forEach((slide: Element) => {
      const slideElement = slide as HTMLElement;
      const isVisible = slideElement.style.display !== 'none';
      
      if (isVisible) {
        slideElement.classList.add('mostage-slide-centered');
        slideElement.style.display = 'flex';
        
        // Apply centering based on config
        if (this.config.vertical && this.config.horizontal) {
          slideElement.style.alignItems = 'center';
          slideElement.style.justifyContent = 'center';
        } else if (this.config.vertical) {
          slideElement.style.alignItems = 'center';
          slideElement.style.justifyContent = 'flex-start';
        } else if (this.config.horizontal) {
          slideElement.style.alignItems = 'flex-start';
          slideElement.style.justifyContent = 'center';
        }
      } else {
        slideElement.classList.remove('mostage-slide-centered');
      }
    });
  }

  destroy(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    const slides = document.querySelectorAll('.mostage-slide');
    slides.forEach((slide: Element) => {
      slide.classList.remove('mostage-slide-centered');
    });
  }
}

export default CenterContentPlugin;
