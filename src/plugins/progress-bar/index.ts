import { MoPlugin } from '../../types';
import styles from './style.css?inline';

export class ProgressBarPlugin implements MoPlugin {
  name = 'ProgressBar';
  private progressBar: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;

  init(mo: any): void {
    this.injectStyles();
    this.createProgressBar();
    this.updateProgress(mo.getCurrentSlide(), mo.getTotalSlides());
    
    mo.on('slidechange', (event: any) => {
      this.updateProgress(event.currentSlide, event.totalSlides);
    });
  }

  private injectStyles(): void {
    if (document.querySelector('[data-mostage-progress-styles]')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('data-mostage-progress-styles', 'true');
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private createProgressBar(): void {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'mostage-progress-bar';
    this.progressBar.innerHTML = '<div class="mostage-progress-fill"></div>';
    document.body.appendChild(this.progressBar);
  }

  private updateProgress(current: number, total: number): void {
    if (!this.progressBar) return;
    
    const fill = this.progressBar.querySelector('.mostage-progress-fill') as HTMLElement;
    if (fill) {
      const percentage = ((current + 1) / total) * 100;
      fill.style.width = `${percentage}%`;
    }
  }

  destroy(): void {
    if (this.progressBar) {
      this.progressBar.remove();
      this.progressBar = null;
    }
    
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}
