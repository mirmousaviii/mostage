export interface TransitionConfig {
  type?: "horizontal" | "vertical" | "fade" | "slide";
  duration?: number;
  easing?: string;
}

export class TransitionManager {
  private container: HTMLElement;
  private transitionConfig: TransitionConfig;

  constructor(container: HTMLElement, transitionConfig: TransitionConfig) {
    this.container = container;
    this.transitionConfig = transitionConfig;
  }

  animateTransition(fromIndex: number, toIndex: number): void {
    const slides = this.container.querySelectorAll(".mostage-slide");
    const fromSlide = slides[fromIndex] as HTMLElement;
    const toSlide = slides[toIndex] as HTMLElement;

    if (!fromSlide || !toSlide) return;

    if (fromIndex === toIndex) {
      this.showSlide(toIndex);
      return;
    }

    const duration = this.transitionConfig.duration || 300;

    // Clear any existing transitions first
    fromSlide.style.transition = "";
    toSlide.style.transition = "";

    // Apply transition based on config
    switch (this.transitionConfig.type) {
      case "fade":
        this.fadeTransition(fromSlide, toSlide, duration);
        break;
      case "vertical":
        this.verticalTransition(
          fromSlide,
          toSlide,
          toIndex > fromIndex,
          duration
        );
        break;
      case "slide":
        this.slideTransition(fromSlide, toSlide, toIndex > fromIndex, duration);
        break;
      case "horizontal":
      default:
        this.horizontalTransition(
          fromSlide,
          toSlide,
          toIndex > fromIndex,
          duration
        );
        break;
    }
  }

  showSlide(index: number): void {
    const slides = this.container.querySelectorAll(".mostage-slide");
    slides.forEach((slide, i) => {
      const slideElement = slide as HTMLElement;
      slideElement.style.display = i === index ? "block" : "none";
      slideElement.style.opacity = "1";
      slideElement.style.transform = "";
    });
  }

  private fadeTransition(
    fromSlide: HTMLElement,
    toSlide: HTMLElement,
    duration: number
  ): void {
    // Clear any existing transitions first
    fromSlide.style.transition = "";
    toSlide.style.transition = "";

    // Set up initial states
    fromSlide.style.opacity = "1";
    toSlide.style.display = "block";
    toSlide.style.opacity = "0";

    // Force reflow to ensure initial positioning
    toSlide.offsetHeight;

    // Set transitions for smooth animation
    fromSlide.style.transition = `opacity ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;
    toSlide.style.transition = `opacity ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;

    setTimeout(() => {
      fromSlide.style.opacity = "0";
      toSlide.style.opacity = "1";

      setTimeout(() => {
        fromSlide.style.display = "none";
        fromSlide.style.opacity = "1";
        toSlide.style.opacity = "1";
        // Clear transitions after animation
        fromSlide.style.transition = "";
        toSlide.style.transition = "";
      }, duration);
    }, 50);
  }

  private horizontalTransition(
    fromSlide: HTMLElement,
    toSlide: HTMLElement,
    isNext: boolean,
    duration: number
  ): void {
    const direction = isNext ? "translateX(-100%)" : "translateX(100%)";
    const enterDirection = isNext ? "translateX(100%)" : "translateX(-100%)";

    // Clear any existing transitions first
    fromSlide.style.transition = "";
    toSlide.style.transition = "";

    toSlide.style.display = "block";
    toSlide.style.transform = enterDirection;

    // Force reflow to ensure initial positioning
    toSlide.offsetHeight;

    // Set transitions for smooth animation
    fromSlide.style.transition = `transform ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;
    toSlide.style.transition = `transform ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;

    setTimeout(() => {
      fromSlide.style.transform = direction;
      toSlide.style.transform = "translateX(0)";

      setTimeout(() => {
        fromSlide.style.display = "none";
        fromSlide.style.transform = "";
        toSlide.style.transform = "";
        // Clear transitions after animation
        fromSlide.style.transition = "";
        toSlide.style.transition = "";
      }, duration);
    }, 50);
  }

  private verticalTransition(
    fromSlide: HTMLElement,
    toSlide: HTMLElement,
    isNext: boolean,
    duration: number
  ): void {
    const direction = isNext ? "translateY(-100%)" : "translateY(100%)";
    const enterDirection = isNext ? "translateY(100%)" : "translateY(-100%)";

    // Clear any existing transitions first
    fromSlide.style.transition = "";
    toSlide.style.transition = "";

    toSlide.style.display = "block";
    toSlide.style.transform = enterDirection;

    // Force reflow to ensure initial positioning
    toSlide.offsetHeight;

    // Set transitions for smooth animation
    fromSlide.style.transition = `transform ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;
    toSlide.style.transition = `transform ${duration}ms ${this.transitionConfig.easing || "ease-in-out"}`;

    setTimeout(() => {
      fromSlide.style.transform = direction;
      toSlide.style.transform = "translateY(0)";

      setTimeout(() => {
        fromSlide.style.display = "none";
        fromSlide.style.transform = "";
        toSlide.style.transform = "";
        // Clear transitions after animation
        fromSlide.style.transition = "";
        toSlide.style.transition = "";
      }, duration);
    }, 50);
  }

  private slideTransition(
    fromSlide: HTMLElement,
    toSlide: HTMLElement,
    isNext: boolean,
    duration: number
  ): void {
    // Similar to horizontal but with different easing
    this.horizontalTransition(fromSlide, toSlide, isNext, duration);
  }
}
