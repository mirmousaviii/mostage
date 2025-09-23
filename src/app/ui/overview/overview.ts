import { HelpComponent } from "../help/help";

export class OverviewManager {
  private container: HTMLElement;
  private currentSlideIndex = 0;
  private isOverviewMode = false;
  private overviewContainer: HTMLElement | null = null;
  private overviewSelectedIndex = 0;
  private onSlideChange: (index: number) => void;
  private onExitOverview: () => void;
  private onEnterOverview: () => void;
  private helpComponent: HelpComponent;

  constructor(
    container: HTMLElement,
    onSlideChange: (index: number) => void,
    onExitOverview: () => void,
    onEnterOverview?: () => void
  ) {
    this.container = container;
    this.onSlideChange = onSlideChange;
    this.onExitOverview = onExitOverview;
    this.onEnterOverview = onEnterOverview || (() => {});
    this.helpComponent = new HelpComponent("overview");
  }

  setCurrentSlideIndex(index: number): void {
    this.currentSlideIndex = index;
  }

  toggleOverview(): void {
    if (this.isOverviewMode) {
      this.exitOverview();
    } else {
      this.enterOverview();
    }
  }

  isInOverviewMode(): boolean {
    return this.isOverviewMode;
  }

  /**
   * Handles keyboard events in overview mode
   * Supports navigation (arrows, home, end) and actions (enter, escape, o)
   */
  handleOverviewKeyboard(event: KeyboardEvent): void {
    if (!this.isOverviewMode) return;

    const key = event.key;
    const keyLower = key.toLowerCase();

    // Handle navigation keys
    if (key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      this.nextOverviewSlide();
      return;
    }

    if (key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      this.previousOverviewSlide();
      return;
    }

    if (key === "Home") {
      event.preventDefault();
      event.stopPropagation();
      this.goToFirstSlide();
      return;
    }

    if (key === "End") {
      event.preventDefault();
      event.stopPropagation();
      this.goToLastSlide();
      return;
    }

    if (key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.selectOverviewSlide();
      return;
    }

    if (key === "Escape" || keyLower === "o") {
      event.preventDefault();
      event.stopPropagation();
      this.exitOverview();
      return;
    }
  }

  private getThumbnails(): NodeListOf<Element> | null {
    return (
      this.overviewContainer?.querySelectorAll(".mostage-overview-slide") ||
      null
    );
  }

  private goToFirstSlide(): void {
    this.overviewSelectedIndex = 0;
    this.updateOverviewSelection();
  }

  private goToLastSlide(): void {
    const thumbnails = this.getThumbnails();
    const actualSlidesCount = thumbnails?.length || 0;

    this.overviewSelectedIndex = actualSlidesCount - 1;
    this.updateOverviewSelection();
  }

  private enterOverview(): void {
    if (this.isOverviewMode) return;

    this.isOverviewMode = true;
    this.overviewSelectedIndex = this.currentSlideIndex;
    this.onEnterOverview();
    this.createOverviewGrid();
  }

  private exitOverview(): void {
    if (!this.isOverviewMode) return;

    this.isOverviewMode = false;
    this.removeOverviewContainer();
    this.onExitOverview();
  }

  private removeOverviewContainer(): void {
    if (this.overviewContainer) {
      this.overviewContainer.remove();
      this.overviewContainer = null;
    }
  }

  private nextOverviewSlide(): void {
    const thumbnails = this.getThumbnails();
    const actualSlidesCount = thumbnails?.length || 0;

    if (this.overviewSelectedIndex < actualSlidesCount - 1) {
      this.overviewSelectedIndex++;
      this.updateOverviewSelection();
    }
  }

  private previousOverviewSlide(): void {
    if (this.overviewSelectedIndex > 0) {
      this.overviewSelectedIndex--;
      this.updateOverviewSelection();
    }
  }

  private selectOverviewSlide(): void {
    this.onSlideChange(this.overviewSelectedIndex);
    this.exitOverview();
  }

  private updateOverviewSelection(): void {
    const thumbnails = this.getThumbnails();
    if (!thumbnails) return;

    if (this.overviewSelectedIndex >= thumbnails.length) return;

    thumbnails.forEach((thumbnail: Element, index: number) => {
      const slideElement = thumbnail as HTMLElement;
      if (index === this.overviewSelectedIndex) {
        slideElement.classList.add("selected");
        slideElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        slideElement.classList.remove("selected");
      }
    });
  }

  private createOverviewGrid(): void {
    this.overviewContainer = document.createElement("div");
    this.overviewContainer.className = "mostage-overview";

    const slideElements = this.container.querySelectorAll(
      ".mostage-slide"
    ) as NodeListOf<HTMLElement>;
    const currentSlideIndex = this.currentSlideIndex;

    slideElements.forEach((slideElement: HTMLElement, index: number) => {
      const thumbnail = this.createThumbnail(
        slideElement,
        index,
        currentSlideIndex
      );
      this.overviewContainer!.appendChild(thumbnail);
    });

    const closeButton = this.createCloseButton();
    this.overviewContainer.appendChild(closeButton);

    const helpComponent = this.createHelpComponent();
    this.helpComponent.addCloseButtonListener(helpComponent, () => {
      // Hide help with animation
      this.hideOverviewHelp(helpComponent);
    });
    this.overviewContainer.appendChild(helpComponent);

    // Trigger fade-in animation for overview help
    requestAnimationFrame(() => {
      helpComponent.classList.add("fade-in");
    });

    document.body.appendChild(this.overviewContainer);

    // Set initial selection
    this.updateOverviewSelection();
  }

  private createThumbnail(
    slideElement: HTMLElement,
    index: number,
    currentIndex: number
  ): HTMLElement {
    const thumbnail = document.createElement("div");
    thumbnail.className = "mostage-overview-slide";

    if (index === currentIndex) {
      thumbnail.classList.add("active");
    }

    // Get theme-aware background color from the original slide
    const computedStyle = window.getComputedStyle(slideElement);
    const backgroundColor = computedStyle.backgroundColor;
    if (
      backgroundColor &&
      backgroundColor !== "rgba(0, 0, 0, 0)" &&
      backgroundColor !== "transparent"
    ) {
      thumbnail.style.backgroundColor = backgroundColor;
    }

    // Create slide number element
    const slideNumber = document.createElement("div");
    slideNumber.className = "mostage-overview-slide-number";
    slideNumber.textContent = (index + 1).toString();

    // Create content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "mostage-overview-slide-content";

    // Create a simplified version of the slide content for the thumbnail
    const content = slideElement.innerHTML;
    contentWrapper.innerHTML = content;

    // Assemble the thumbnail
    thumbnail.appendChild(slideNumber);
    thumbnail.appendChild(contentWrapper);

    thumbnail.addEventListener("click", () => {
      this.overviewSelectedIndex = index;
      this.updateOverviewSelection();
      this.selectOverviewSlide();
    });

    return thumbnail;
  }

  private createCloseButton(): HTMLElement {
    const closeButton = document.createElement("button");
    closeButton.className = "mostage-overview-close";
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", () => {
      this.exitOverview();
    });
    return closeButton;
  }

  private createHelpComponent(): HTMLElement {
    return this.helpComponent.createHelpElement();
  }

  // Hide overview help with fade-out animation
  private hideOverviewHelp(helpComponent: HTMLElement): void {
    // Add fade-out class for animation
    helpComponent.classList.add("fade-out");
    helpComponent.classList.remove("fade-in");

    // Wait for animation to complete, then hide element
    setTimeout(() => {
      helpComponent.style.display = "none";
    }, 300); // Match CSS transition duration
  }
}
