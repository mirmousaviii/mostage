import { MoPlugin } from '../../types';

export class ProgressBarPlugin implements MoPlugin {
  name = 'ProgressBar';
  private progressBar: HTMLElement | null = null;

  init(mo: any): void {
    this.createProgressBar();
    this.updateProgress(mo.getCurrentSlide(), mo.getTotalSlides());
    
    mo.on('slidechange', (event: any) => {
      this.updateProgress(event.currentSlide, event.totalSlides);
    });
  }

  private createProgressBar(): void {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'mo-progress-bar';
    this.progressBar.innerHTML = '<div class="mo-progress-fill"></div>';
    document.body.appendChild(this.progressBar);
  }

  private updateProgress(current: number, total: number): void {
    if (!this.progressBar) return;
    
    const fill = this.progressBar.querySelector('.mo-progress-fill') as HTMLElement;
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
  }
}
