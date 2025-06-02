import { MoPlugin } from '../types';

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
    this.slideNumber.className = 'mo-slide-number';
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

export class ControllerPlugin implements MoPlugin {
  name = 'Controller';
  private controller: HTMLElement | null = null;

  init(mo: any): void {
    this.createController(mo);
  }

  private createController(mo: any): void {
    this.controller = document.createElement('div');
    this.controller.className = 'mo-controller';
    this.controller.innerHTML = `
      <button class="mo-btn mo-prev">‹</button>
      <button class="mo-btn mo-next">›</button>
    `;
    
    const prevBtn = this.controller.querySelector('.mo-prev') as HTMLElement;
    const nextBtn = this.controller.querySelector('.mo-next') as HTMLElement;
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => mo.previousSlide());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => mo.nextSlide());
    }
    
    document.body.appendChild(this.controller);
  }

  destroy(): void {
    if (this.controller) {
      this.controller.remove();
      this.controller = null;
    }
  }
}

export class OverviewModePlugin implements MoPlugin {
  name = 'OverviewMode';
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;

  init(mo: any): void {
    this.createOverviewToggle(mo);
    this.setupKeyboardShortcut(mo);
  }

  private createOverviewToggle(mo: any): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'o') {
        this.toggleOverview(mo);
      }
    });
  }

  private setupKeyboardShortcut(mo: any): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'o' && !this.isOverviewMode) {
        this.toggleOverview(mo);
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
    container.classList.add('mo-overview-mode');
    
    this.overviewContainer = document.createElement('div');
    this.overviewContainer.className = 'mo-overview-grid';
    
    const slides = mo.getSlides();
    slides.forEach((slide: any, index: number) => {
      const slideThumb = document.createElement('div');
      slideThumb.className = 'mo-overview-slide';
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
    container.classList.remove('mo-overview-mode');
    
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
  }
}

// Plugin registry
export const builtInPlugins: Record<string, new () => MoPlugin> = {
  ProgressBar: ProgressBarPlugin,
  SlideNumber: SlideNumberPlugin,
  Controller: ControllerPlugin,
  OverviewMode: OverviewModePlugin
};
