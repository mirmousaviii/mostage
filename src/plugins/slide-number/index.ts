import { MoPlugin } from '../../types';

export class SlideNumberPlugin implements MoPlugin {
  name = 'SlideNumber';
  private slideNumber: HTMLElement | null = null;

  init(mo: any): void {
    this.createSlideNumber();
    this.updateSlideNumber(mo.getCurrentSlide(), mo.getTotalSlides());
    
    mo.on('slidechange', (event: any) => {
      this.updateSlideNumber(event.currentSlide, event.totalSlides);
    });
  }

  private createSlideNumber(): void {
    this.slideNumber = document.createElement('div');
    this.slideNumber.className = 'mostage-slide-number';
    document.body.appendChild(this.slideNumber);
  }

  private updateSlideNumber(current: number, total: number): void {
    if (this.slideNumber) {
      this.slideNumber.textContent = `${current + 1} / ${total}`;
    }
  }

  destroy(): void {
    if (this.slideNumber) {
      this.slideNumber.remove();
      this.slideNumber = null;
    }
  }
}
