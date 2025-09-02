import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class ControllerPlugin implements MoPlugin {
  name = 'Controller';
  private controller: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;

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

    // Add event listeners
    const prevBtn = this.controller.querySelector('.mostage-prev') as HTMLButtonElement;
    const nextBtn = this.controller.querySelector('.mostage-next') as HTMLButtonElement;

    prevBtn.addEventListener('click', () => {
      mo.previousSlide();
    });

    nextBtn.addEventListener('click', () => {
      mo.nextSlide();
    });

    // Update button states
    mo.on('slidechange', (event: any) => {
      prevBtn.disabled = event.currentSlide === 1;
      nextBtn.disabled = event.currentSlide === event.totalSlides;
    });

    document.body.appendChild(this.controller);
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
  }
}
