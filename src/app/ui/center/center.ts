export interface CenterContentConfig {
  vertical?: boolean;
  horizontal?: boolean;
}

export class CenterContentManager {
  private centerContentConfig: CenterContentConfig | null = null;

  constructor(private container: HTMLElement) {}

  initialize(config: CenterContentConfig | null): void {
    if (!config) return;

    this.centerContentConfig = {
      vertical: true,
      horizontal: true,
      ...config,
    };

    // If both vertical and horizontal are false, disable centerContent
    if (
      !this.centerContentConfig.vertical &&
      !this.centerContentConfig.horizontal
    ) {
      this.centerContentConfig = null;
      return;
    }

    this.setupCenterContentObserver();
    setTimeout(() => this.updateCurrentSlideCentering(), 100);
  }

  onSlideChange(): void {
    setTimeout(() => this.updateCurrentSlideCentering(), 50);
  }

  private setupCenterContentObserver(): void {
    const observer = new MutationObserver(() => {
      this.updateCurrentSlideCentering();
    });

    if (this.container) {
      observer.observe(this.container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  }

  private updateCurrentSlideCentering(): void {
    if (!this.centerContentConfig) return;

    const slides = document.querySelectorAll(".mostage-slide");
    slides.forEach((slide: Element) => {
      const slideElement = slide as HTMLElement;
      const isVisible = slideElement.style.display !== "none";
      const contentWrapper = slideElement.querySelector(
        ".mostage-slide-content"
      ) as HTMLElement;

      if (isVisible && contentWrapper) {
        slideElement.classList.add("mostage-slide-centered");
        slideElement.style.display = "flex";
        contentWrapper.style.display = "flex";
        contentWrapper.style.flexDirection = "column";

        // Apply centering based on config
        if (
          this.centerContentConfig!.vertical &&
          this.centerContentConfig!.horizontal
        ) {
          slideElement.style.alignItems = "center";
          slideElement.style.justifyContent = "center";
          contentWrapper.style.alignItems = "center";
          contentWrapper.style.justifyContent = "center";
        } else if (this.centerContentConfig!.vertical) {
          slideElement.style.alignItems = "center";
          slideElement.style.justifyContent = "flex-start";
          contentWrapper.style.alignItems = "center";
          contentWrapper.style.justifyContent = "flex-start";
        } else if (this.centerContentConfig!.horizontal) {
          slideElement.style.alignItems = "flex-start";
          slideElement.style.justifyContent = "center";
          contentWrapper.style.alignItems = "flex-start";
          contentWrapper.style.justifyContent = "center";
        }
      } else {
        slideElement.classList.remove("mostage-slide-centered");
        if (contentWrapper) {
          contentWrapper.style.display = "block";
          contentWrapper.style.flexDirection = "unset";
          contentWrapper.style.alignItems = "unset";
          contentWrapper.style.justifyContent = "unset";
        }
      }
    });
  }

  cleanup(): void {
    // Clean up center content classes
    const slides = document.querySelectorAll(".mostage-slide");
    slides.forEach((slide: Element) => {
      slide.classList.remove("mostage-slide-centered");
    });
  }
}
