export interface CenterContentConfig {
  vertical?: boolean;
  horizontal?: boolean;
}

export class CenterContentManager {
  private centerContentConfig: CenterContentConfig | null = null;
  private observer: MutationObserver | null = null;
  private isUpdating = false; // re-entrancy guard to avoid observer feedback loops
  private scheduled = false; // coalesce multiple mutations into one update frame

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
    // Initial apply after DOM settles
    setTimeout(() => this.updateCurrentSlideCentering(), 100);
  }

  onSlideChange(): void {
    setTimeout(() => this.updateCurrentSlideCentering(), 50);
  }

  private setupCenterContentObserver(): void {
    // Disconnect any existing observer first
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.observer = new MutationObserver(() => {
      // Ignore mutations triggered by our own style writes
      if (this.isUpdating) return;

      // Debounce within a frame to prevent tight loops
      if (this.scheduled) return;
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.scheduled = false;
        this.updateCurrentSlideCentering();
      });
    });

    if (this.container) {
      this.observer.observe(this.container, {
        childList: true,
        subtree: true,
        // attributes true can cause feedback loops when we also set styles.
        // We keep it enabled but guard with isUpdating + rAF scheduling.
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  }

  private updateCurrentSlideCentering(): void {
    if (!this.centerContentConfig) return;
    this.isUpdating = true;

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

    this.isUpdating = false;
  }

  cleanup(): void {
    // Clean up center content classes
    const slides = document.querySelectorAll(".mostage-slide");
    slides.forEach((slide: Element) => {
      slide.classList.remove("mostage-slide-centered");
    });

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
