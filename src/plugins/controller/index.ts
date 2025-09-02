import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class ControllerPlugin implements MoPlugin {
  name = 'Controller';
  private controller: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;

  init(mo: any): void {
    this.injectStyles();
    this.createController(mo);
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-controller-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-controller-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private createController(mo: any): void {
    this.controller = document.createElement('div');
    this.controller.className = 'mostage-controller';
    this.controller.innerHTML = `
      <button class="mostage-btn mostage-prev">‹</button>
      <button class="mostage-btn mostage-next">›</button>
    `;

    // Get button references
    this.prevBtn = this.controller.querySelector('.mostage-prev') as HTMLButtonElement;
    this.nextBtn = this.controller.querySelector('.mostage-next') as HTMLButtonElement;

    // Add event listeners
    this.prevBtn.addEventListener('click', () => mo.previousSlide());
    this.nextBtn.addEventListener('click', () => mo.nextSlide());

    // Listen for slide changes and update button states
    mo.on('slidechange', (event: any) => {
      this.updateButtonStates(event.currentSlide, event.totalSlides);
    });

    // Set initial button states
    this.updateButtonStates(mo.getCurrentSlide(), mo.getTotalSlides());

    document.body.appendChild(this.controller);
  }

  private updateButtonStates(currentSlide: number, totalSlides: number): void {
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.disabled = currentSlide === 0;
      this.nextBtn.disabled = currentSlide === totalSlides - 1;
    }
  }

  destroy(): void {
    if (this.controller) {
      this.controller.remove();
      this.controller = null;
    }
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    this.prevBtn = null;
    this.nextBtn = null;
  }
}
