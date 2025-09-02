import { MoPlugin } from '../../types';

export class OverviewModePlugin implements MoPlugin {
  name = 'OverviewMode';
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;

  init(mo: any): void {
    this.setupKeyboardShortcuts(mo);
  }

  private setupKeyboardShortcuts(mo: any): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        this.toggleOverview(mo);
      }
      
      if (e.key === 'Escape' && this.isOverviewMode) {
        e.preventDefault();
        this.exitOverview(mo);
      }
    });
  }

  private toggleOverview(mo: any): void {
    if (this.isOverviewMode) {
      this.exitOverview(mo);
    } else {
      this.enterOverview(mo);
    }
  }

  private enterOverview(mo: any): void {
    this.isOverviewMode = true;
    const container = mo.getContainer();
    container.classList.add('mostage-overview-mode');
    
    this.overviewContainer = document.createElement('div');
    this.overviewContainer.className = 'mostage-overview-grid';
    
    const slides = mo.getSlides();
    slides.forEach((slide: any, index: number) => {
      const slideThumb = document.createElement('div');
      slideThumb.className = 'mostage-overview-slide';
      slideThumb.innerHTML = slide.html;
      slideThumb.addEventListener('click', () => {
        this.exitOverview(mo);
        mo.goToSlide(index);
      });
      this.overviewContainer!.appendChild(slideThumb);
    });
    
    container.appendChild(this.overviewContainer);
  }

  private exitOverview(mo: any): void {
    this.isOverviewMode = false;
    const container = mo.getContainer();
    container.classList.remove('mostage-overview-mode');
    
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
  }

  destroy(): void {
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
    this.isOverviewMode = false;
  }
}
