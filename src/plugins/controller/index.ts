import { MoPlugin, ControllerConfig } from "../../types";
import styles from "./style.css?inline";

export class ControllerPlugin implements MoPlugin {
  name = "Controller";
  private controller: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private firstBtn: HTMLButtonElement | null = null;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private lastBtn: HTMLButtonElement | null = null;
  private config!: ControllerConfig;

  init(mo: any, config: ControllerConfig = {}): void {
    this.config = {
      show: true,
      position: "bottom-center",
      ...config,
    };

    this.injectStyles();
    this.createController(mo);
  }

  private injectStyles(): void {
    if (document.querySelector("[data-mostage-controller-styles]")) return;

    this.styleElement = document.createElement("style");
    this.styleElement.setAttribute("data-mostage-controller-styles", "true");
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  private createController(mo: any): void {
    this.controller = document.createElement("div");
    this.controller.className = `mostage-controller mostage-controller-${this.config.position}`;
    this.controller.innerHTML = `
      <button class="mostage-btn mostage-first">|‹</button>
      <button class="mostage-btn mostage-prev">‹</button>
      <button class="mostage-btn mostage-next">›</button>
      <button class="mostage-btn mostage-last">›|</button>
    `;

    // Show/hide based on config
    if (!this.config.show) {
      this.controller.style.display = "none";
    }

    // Get button references
    this.firstBtn = this.controller.querySelector(
      ".mostage-first"
    ) as HTMLButtonElement;
    this.prevBtn = this.controller.querySelector(
      ".mostage-prev"
    ) as HTMLButtonElement;
    this.nextBtn = this.controller.querySelector(
      ".mostage-next"
    ) as HTMLButtonElement;
    this.lastBtn = this.controller.querySelector(
      ".mostage-last"
    ) as HTMLButtonElement;

    // Add event listeners
    this.firstBtn.addEventListener("click", () => mo.goToSlide(0));
    this.prevBtn.addEventListener("click", () => mo.previousSlide());
    this.nextBtn.addEventListener("click", () => mo.nextSlide());
    this.lastBtn.addEventListener("click", () =>
      mo.goToSlide(mo.getTotalSlides() - 1)
    );

    // Listen for slide changes and update button states
    mo.on("slidechange", (event: any) => {
      this.updateButtonStates(event.currentSlide, event.totalSlides);
    });

    // Set initial button states
    this.updateButtonStates(mo.getCurrentSlide(), mo.getTotalSlides());

    document.body.appendChild(this.controller);
  }

  private updateButtonStates(currentSlide: number, totalSlides: number): void {
    if (this.firstBtn && this.prevBtn && this.nextBtn && this.lastBtn) {
      this.firstBtn.disabled = currentSlide === 0;
      this.prevBtn.disabled = currentSlide === 0;
      this.nextBtn.disabled = currentSlide === totalSlides - 1;
      this.lastBtn.disabled = currentSlide === totalSlides - 1;
    }
  }

  destroy(): void {
    if (this.controller) {
      this.controller.remove();
      this.controller = null;
    }
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    this.firstBtn = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.lastBtn = null;
  }
}

export default ControllerPlugin;
