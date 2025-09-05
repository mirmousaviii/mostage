import { MoPlugin, OverviewModeConfig } from '../../types';
import styles from './style.css?inline';

export class OverviewModePlugin implements MoPlugin {
  name = 'OverviewMode';
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private keyboardHandler: ((event: KeyboardEvent) => void) | null = null;
  private config!: OverviewModeConfig;

  init(mo: any, config: OverviewModeConfig = {}): void {
    this.config = {
      scale: 0.2,
      ...config
    };

    this.injectStyles();
    this.setupKeyboardListeners(mo);
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-overview-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-overview-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private setupKeyboardListeners(mo: any): void {
    this.keyboardHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'o') {
        this.toggleOverview(mo);
      }
    };
    
    document.addEventListener('keydown', this.keyboardHandler);
  }

  private toggleOverview(mo: any): void {
    if (this.isOverviewMode) {
      this.exitOverview();
    } else {
      this.enterOverview(mo);
    }
  }

  private enterOverview(mo: any): void {
    if (this.isOverviewMode) return;

    this.isOverviewMode = true;
    this.createOverviewGrid(mo);
  }

  private exitOverview(): void {
    if (!this.isOverviewMode) return;

    this.isOverviewMode = false;
    this.removeOverviewContainer();
  }

  private removeOverviewContainer(): void {
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
  }

  private createOverviewGrid(mo: any): void {
    this.overviewContainer = document.createElement('div');
    this.overviewContainer.className = 'mostage-overview';
    this.overviewContainer.style.setProperty('--overview-scale', this.config.scale!.toString());

    const slideElements = mo.getContainer().querySelectorAll('.mostage-slide') as NodeListOf<HTMLElement>;
    const currentSlideIndex = mo.getCurrentSlide();

    slideElements.forEach((slideElement: HTMLElement, index: number) => {
      const thumbnail = this.createThumbnail(slideElement, index, currentSlideIndex, mo);
      this.overviewContainer!.appendChild(thumbnail);
    });

    const closeButton = this.createCloseButton();
    this.overviewContainer.appendChild(closeButton);
    document.body.appendChild(this.overviewContainer);
  }

  private createThumbnail(slideElement: HTMLElement, index: number, currentIndex: number, mo: any): HTMLElement {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'mostage-overview-slide';
    
    if (index === currentIndex) {
      thumbnail.classList.add('active');
    }

    thumbnail.innerHTML = slideElement.innerHTML;
    thumbnail.style.transform = `scale(${this.config.scale})`;
    thumbnail.addEventListener('click', () => {
      mo.goToSlide(index);
      this.exitOverview();
    });

    return thumbnail;
  }

  private createCloseButton(): HTMLElement {
    const closeButton = document.createElement('button');
    closeButton.className = 'mostage-overview-close';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
      this.exitOverview();
    });
    return closeButton;
  }

  destroy(): void {
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }
    
    this.removeOverviewContainer();
    
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    this.isOverviewMode = false;
  }
}

export default OverviewModePlugin;
