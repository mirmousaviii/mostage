import { MoSlide } from "@/types";

export class NavigationManager {
  private container: HTMLElement;
  private slides: MoSlide[] = [];
  private currentSlideIndex = 0;
  private touchEnabled: boolean;
  private onSlideChange: (index: number) => void;

  constructor(
    container: HTMLElement,
    _keyboardEnabled: boolean,
    touchEnabled: boolean,
    onSlideChange: (index: number) => void
  ) {
    this.container = container;
    this.touchEnabled = touchEnabled;
    this.onSlideChange = onSlideChange;
  }

  setSlides(slides: MoSlide[]): void {
    this.slides = slides;
  }

  setCurrentSlideIndex(index: number): void {
    this.currentSlideIndex = index;
  }

  setupNavigation(): void {
    if (this.touchEnabled) {
      this.setupTouchNavigation();
    }
  }

  private setupTouchNavigation(): void {
    let startX = 0;
    let startY = 0;

    this.container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.container.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Check horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
      // Check vertical swipe
      else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          // Swipe down - go to previous slide
          this.previousSlide();
        } else {
          // Swipe up - go to next slide
          this.nextSlide();
        }
      }
    });
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;
    this.currentSlideIndex = index;
    this.onSlideChange(index);
  }

  getCurrentSlideIndex(): number {
    return this.currentSlideIndex;
  }

  getTotalSlides(): number {
    return this.slides.length;
  }
}
