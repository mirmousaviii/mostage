import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class OverviewModePlugin implements MoPlugin {
  name = 'OverviewMode';
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;

  init(mo: any): void {
    this.injectStyles();
    this.bindKeyboard(mo);
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-overview-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-overview-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private bindKeyboard(mo: any): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOverviewMode) {
        this.exitOverview(mo);
      } else if (event.key === 'o' && !this.isOverviewMode) {
        this.enterOverview(mo);
      }
    });
  }

  private enterOverview(mo: any): void {
    if (this.isOverviewMode) return;

    this.isOverviewMode = true;
    this.createOverviewGrid(mo);
  }

  private exitOverview(mo: any): void {
    if (!this.isOverviewMode) return;

    this.isOverviewMode = false;
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
  }

  private createOverviewGrid(mo: any): void {
    this.overviewContainer = document.createElement('div');
    this.overviewContainer.className = 'mostage-overview';

    const slides = mo.getAllSlides();
    const currentSlideIndex = mo.getCurrentSlide();

    slides.forEach((slide: HTMLElement, index: number) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'mostage-overview-slide';
      if (index + 1 === currentSlideIndex) {
        thumbnail.classList.add('active');
      }

      thumbnail.innerHTML = slide.innerHTML;
      thumbnail.addEventListener('click', () => {
        mo.goToSlide(index + 1);
        this.exitOverview(mo);
      });

      this.overviewContainer!.appendChild(thumbnail);
    });

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'mostage-overview-close';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
      this.exitOverview(mo);
    });

    this.overviewContainer.appendChild(closeButton);
    document.body.appendChild(this.overviewContainer);
  }

  destroy(): void {
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}
