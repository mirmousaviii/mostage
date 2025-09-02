import { MoPlugin } from '../../types';

export class ControllerPlugin implements MoPlugin {
  name = 'Controller';
  private controller: HTMLElement | null = null;

  init(mo: any): void {
    this.createController(mo);
  }

  private createController(mo: any): void {
    this.controller = document.createElement('div');
    this.controller.className = 'mostage-controller';
    this.controller.innerHTML = `
      <button class="mostage-btn mostage-prev">‹</button>
      <button class="mostage-btn mostage-next">›</button>
    `;
    
    const prevBtn = this.controller.querySelector('.mostage-prev') as HTMLElement;
    const nextBtn = this.controller.querySelector('.mostage-next') as HTMLElement;
    
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
