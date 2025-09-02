import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class OverviewModePlugin implements MoPlugin {
  name = 'OverviewMode';
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private keyboardHandler: ((event: KeyboardEvent) => void) | null = null;

  init(mo: any): void {
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
        // Toggle overview mode with both Escape and 'o' keys
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

    // Get actual slide DOM elements instead of slide data
    const slideElements = mo.getContainer().querySelectorAll('.mostage-slide') as NodeListOf<HTMLElement>;
    const currentSlideIndex = mo.getCurrentSlide();

    slideElements.forEach((slideElement: HTMLElement, index: number) => {
      const thumbnail = this.createThumbnail(slideElement, index, currentSlideIndex, mo);
      this.overviewContainer!.appendChild(thumbnail);
    });

    // Add close button
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
    // Remove keyboard event listener
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }
    
    // Clean up overview container
    this.removeOverviewContainer();
    
    // Clean up styles
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    // Reset state
    this.isOverviewMode = false;
  }
}
