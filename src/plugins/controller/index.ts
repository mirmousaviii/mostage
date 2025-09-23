import { PluginBase } from "../../app/plugin-base";
import { ControllerConfig } from "../../types";
import styles from "./style.css?inline";

export class ControllerPlugin extends PluginBase {
  name = "Controller";
  private controller: HTMLElement | null = null;
  private firstBtn: HTMLButtonElement | null = null;
  private prevBtn: HTMLButtonElement | null = null;
  private overviewBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private lastBtn: HTMLButtonElement | null = null;
  private config!: ControllerConfig;

  init(mo: any, config: ControllerConfig = {}): void {
    this.config = {
      show: true,
      position: "bottom-center",
      ...config,
    };

    this.injectStyles(styles, "controller-styles");
    this.createController(mo);
  }

  private createController(mo: any): void {
    this.controller = document.createElement("div");
    this.controller.className = `mostage-controller mostage-controller-${this.config.position}`;
    this.controller.innerHTML = `
      <button class="mostage-btn controller-first">|‹</button>
      <button class="mostage-btn controller-prev">‹</button>
      <button class="mostage-btn controller-overview">⊞</button>
      <button class="mostage-btn controller-next">›</button>
      <button class="mostage-btn controller-last">›|</button>
    `;

    // Show/hide based on config
    if (!this.config.show) {
      this.controller.style.display = "none";
    }

    // Get button references
    this.firstBtn = this.controller.querySelector(
      ".controller-first"
    ) as HTMLButtonElement;
    this.prevBtn = this.controller.querySelector(
      ".controller-prev"
    ) as HTMLButtonElement;
    this.overviewBtn = this.controller.querySelector(
      ".controller-overview"
    ) as HTMLButtonElement;
    this.nextBtn = this.controller.querySelector(
      ".controller-next"
    ) as HTMLButtonElement;
    this.lastBtn = this.controller.querySelector(
      ".controller-last"
    ) as HTMLButtonElement;

    // Add event listeners
    this.firstBtn.addEventListener("click", () => mo.goToSlide(0));
    this.prevBtn.addEventListener("click", () => mo.previousSlide());
    this.overviewBtn.addEventListener("click", () => mo.toggleOverview());
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
    if (
      this.firstBtn &&
      this.prevBtn &&
      this.overviewBtn &&
      this.nextBtn &&
      this.lastBtn
    ) {
      this.firstBtn.disabled = currentSlide === 0;
      this.prevBtn.disabled = currentSlide === 0;
      // Overview button is never disabled
      this.nextBtn.disabled = currentSlide === totalSlides - 1;
      this.lastBtn.disabled = currentSlide === totalSlides - 1;
    }
  }

  destroy(): void {
    this.cleanupElements(this.controller);
    this.cleanupStyles();
    this.controller = null;
    this.firstBtn = null;
    this.prevBtn = null;
    this.overviewBtn = null;
    this.nextBtn = null;
    this.lastBtn = null;
  }
}

export default ControllerPlugin;
