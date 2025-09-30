export class UrlHashManager {
  private urlHashEnabled: boolean;
  private onSlideChange: (index: number) => void;

  constructor(urlHashEnabled: boolean, onSlideChange: (index: number) => void) {
    this.urlHashEnabled = urlHashEnabled;
    this.onSlideChange = onSlideChange;
  }

  setupUrlHashNavigation(): void {
    if (!this.urlHashEnabled) return;

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      const slideIndex = this.getSlideIndexFromHash();
      if (slideIndex !== -1) {
        this.onSlideChange(slideIndex);
      }
    });
  }

  getInitialSlideFromUrl(): number {
    if (!this.urlHashEnabled) return 0;

    const slideIndex = this.getSlideIndexFromHash();
    return slideIndex !== -1 ? slideIndex : 0;
  }

  private getSlideIndexFromHash(): number {
    const hash = window.location.hash;
    if (!hash) return -1;

    // Support both #1 and #slide-1 formats
    const match = hash.match(/^#(?:slide-)?(\d+)$/);
    if (match) {
      const slideNumber = parseInt(match[1], 10);
      // Convert 1-based to 0-based index
      const slideIndex = slideNumber - 1;
      return slideIndex;
    }

    return -1;
  }

  updateUrlHash(slideIndex: number, totalSlides: number): void {
    if (!this.urlHashEnabled) return;

    if (slideIndex < 0 || slideIndex >= totalSlides) return;

    const slideNumber = slideIndex + 1; // Convert to 1-based
    const newHash = `#${slideNumber}`;

    // Update URL without triggering hashchange event
    if (window.location.hash !== newHash) {
      history.replaceState(null, "", newHash);
    }
  }
}
