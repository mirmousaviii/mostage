import { PluginBase } from "../../app/plugin-base";
import { SlideNumberConfig } from "../../types";
import styles from "./style.css?inline";

export class SlideNumberPlugin extends PluginBase {
  name = "SlideNumber";
  private slideNumberElement: HTMLElement | null = null;
  private config!: SlideNumberConfig;

  init(mo: any, config: SlideNumberConfig = {}): void {
    this.config = {
      enabled: true,
      position: "bottom-right",
      format: "current/total",
      ...config,
    };

    // Check if plugin is enabled
    if (!this.checkEnabled()) {
      return;
    }

    this.injectStyles(styles, "slide-number-styles");
    this.createSlideNumber();
    this.updateSlideNumber(mo.getCurrentSlide(), mo.getTotalSlides());

    mo.on("slidechange", (event: any) => {
      this.updateSlideNumber(event.currentSlide, event.totalSlides);
    });
  }

  private createSlideNumber(): void {
    this.slideNumberElement = document.createElement("div");
    this.slideNumberElement.className = `mostage-slide-number mostage-slide-number-${this.config.position}`;
    document.body.appendChild(this.slideNumberElement);
  }

  private updateSlideNumber(current: number, total: number): void {
    if (this.slideNumberElement) {
      // Format based on configuration
      let text = this.config
        .format!.replace("current", (current + 1).toString())
        .replace("total", total.toString());
      this.slideNumberElement.textContent = text;
    }
  }

  destroy(): void {
    this.cleanupElements(this.slideNumberElement);
    this.cleanupStyles();
    this.slideNumberElement = null;
  }
}

export default SlideNumberPlugin;
