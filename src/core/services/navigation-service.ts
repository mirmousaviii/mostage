/**
 * Navigation Service for Mostage
 * Provides centralized navigation management with enhanced functionality
 */

import { MoSlide } from "@/types";

/**
 * Enhanced Navigation Service
 * Manages slide navigation with keyboard, touch, and programmatic controls
 */
export class NavigationService {
  private container: HTMLElement;
  private slides: MoSlide[] = [];
  private currentSlideIndex = 0;
  private keyboardEnabled = false;
  private touchEnabled = false;
  private navigationCallback?: (index: number) => void;
  private eventListeners: Map<string, any> = new Map();

  constructor(
    container: HTMLElement,
    keyboardEnabled: boolean = false,
    touchEnabled: boolean = false,
    navigationCallback?: (index: number) => void
  ) {
    this.container = container;
    this.keyboardEnabled = keyboardEnabled;
    this.touchEnabled = touchEnabled;
    this.navigationCallback = navigationCallback;
  }

  /**
   * Set slides for navigation
   */
  setSlides(slides: MoSlide[]): void {
    this.slides = slides;
    this.currentSlideIndex = Math.min(
      this.currentSlideIndex,
      slides.length - 1
    );
  }

  /**
   * Set current slide index
   */
  setCurrentSlideIndex(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlideIndex = index;
    }
  }

  /**
   * Get current slide index
   */
  getCurrentSlideIndex(): number {
    return this.currentSlideIndex;
  }

  /**
   * Get total number of slides
   */
  getTotalSlides(): number {
    return this.slides.length;
  }

  /**
   * Setup navigation controls
   */
  setupNavigation(): void {
    this.setupKeyboardNavigation();
    this.setupTouchNavigation();
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    if (!this.keyboardEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      this.handleKeyboardEvent(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    this.eventListeners.set("keydown", handleKeyDown);
  }

  /**
   * Setup touch navigation
   */
  private setupTouchNavigation(): void {
    if (!this.touchEnabled) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;

      this.handleTouchGesture(startX, startY, endX, endY);
    };

    this.container.addEventListener("touchstart", handleTouchStart);
    this.container.addEventListener("touchend", handleTouchEnd);

    this.eventListeners.set("touchstart", handleTouchStart);
    this.eventListeners.set("touchend", handleTouchEnd);
  }

  /**
   * Handle keyboard events
   */
  private handleKeyboardEvent(event: KeyboardEvent): void {
    const key = event.key;

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        this.nextSlide();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        this.previousSlide();
        break;
      case "Home":
        event.preventDefault();
        this.goToFirstSlide();
        break;
      case "End":
        event.preventDefault();
        this.goToLastSlide();
        break;
    }
  }

  /**
   * Handle touch gestures
   */
  private handleTouchGesture(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    // Check if it's a horizontal swipe
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > minSwipeDistance
    ) {
      if (deltaX > 0) {
        this.previousSlide();
      } else {
        this.nextSlide();
      }
    }
    // Check if it's a vertical swipe
    else if (
      Math.abs(deltaY) > Math.abs(deltaX) &&
      Math.abs(deltaY) > minSwipeDistance
    ) {
      if (deltaY > 0) {
        // Swipe down - go to previous slide
        this.previousSlide();
      } else {
        // Swipe up - go to next slide
        this.nextSlide();
      }
    }
  }

  /**
   * Navigate to next slide
   */
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  /**
   * Navigate to previous slide
   */
  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  /**
   * Go to first slide
   */
  goToFirstSlide(): void {
    this.goToSlide(0);
  }

  /**
   * Go to last slide
   */
  goToLastSlide(): void {
    this.goToSlide(this.slides.length - 1);
  }

  /**
   * Go to specific slide
   */
  goToSlide(index: number): void {
    if (
      index >= 0 &&
      index < this.slides.length &&
      index !== this.currentSlideIndex
    ) {
      this.currentSlideIndex = index;
      this.navigationCallback?.(index);
    }
  }

  /**
   * Check if navigation is at first slide
   */
  isFirstSlide(): boolean {
    return this.currentSlideIndex === 0;
  }

  /**
   * Check if navigation is at last slide
   */
  isLastSlide(): boolean {
    return this.currentSlideIndex === this.slides.length - 1;
  }

  /**
   * Get navigation statistics
   */
  getNavigationStats(): {
    currentSlide: number;
    totalSlides: number;
    progress: number;
    isFirst: boolean;
    isLast: boolean;
  } {
    return {
      currentSlide: this.currentSlideIndex,
      totalSlides: this.slides.length,
      progress:
        this.slides.length > 0
          ? (this.currentSlideIndex + 1) / this.slides.length
          : 0,
      isFirst: this.isFirstSlide(),
      isLast: this.isLastSlide(),
    };
  }

  /**
   * Enable keyboard navigation
   */
  enableKeyboard(): void {
    this.keyboardEnabled = true;
    this.setupKeyboardNavigation();
  }

  /**
   * Disable keyboard navigation
   */
  disableKeyboard(): void {
    this.keyboardEnabled = false;
    this.removeEventListener("keydown");
  }

  /**
   * Enable touch navigation
   */
  enableTouch(): void {
    this.touchEnabled = true;
    this.setupTouchNavigation();
  }

  /**
   * Disable touch navigation
   */
  disableTouch(): void {
    this.touchEnabled = false;
    this.removeEventListener("touchstart");
    this.removeEventListener("touchend");
  }

  /**
   * Remove specific event listener
   */
  private removeEventListener(eventType: string): void {
    const listener = this.eventListeners.get(eventType);
    if (listener) {
      if (eventType === "keydown") {
        document.removeEventListener(eventType, listener);
      } else {
        this.container.removeEventListener(eventType, listener);
      }
      this.eventListeners.delete(eventType);
    }
  }

  /**
   * Cleanup all event listeners
   */
  destroy(): void {
    this.eventListeners.forEach((listener, eventType) => {
      if (eventType === "keydown") {
        document.removeEventListener(eventType, listener);
      } else {
        this.container.removeEventListener(eventType, listener);
      }
    });
    this.eventListeners.clear();
  }
}
