import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class SlideNumberPlugin implements MoPlugin {
  name = 'SlideNumber';
  private slideNumberElement: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;

  init(mo: any): void {
    this.injectStyles();
    this.createSlideNumber();
    this.updateSlideNumber(mo.getCurrentSlide(), mo.getTotalSlides());
    
    mo.on('slidechange', (event: any) => {
      this.updateSlideNumber(event.currentSlide, event.totalSlides);
    });
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-slide-number-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-slide-number-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private createSlideNumber(): void {
    this.slideNumberElement = document.createElement('div');
    this.slideNumberElement.className = 'mostage-slide-number';
    document.body.appendChild(this.slideNumberElement);
  }

  private updateSlideNumber(current: number, total: number): void {
    if (this.slideNumberElement) {
      this.slideNumberElement.textContent = `${current}/${total}`;
    }
  }

  destroy(): void {
    if (this.slideNumberElement) {
      this.slideNumberElement.remove();
      this.slideNumberElement = null;
    }
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}
