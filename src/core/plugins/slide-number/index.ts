import { PluginBase } from "@/core/plugin-base";
import styles from "./style.css?inline";

export interface SlideNumberConfig {
  enabled?: boolean;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  format?: string;
}

export class SlideNumberPlugin extends PluginBase {
  name = "SlideNumber";
  private slideNumberElement: HTMLElement | null = null;
  private config!: SlideNumberConfig;
  private container: HTMLElement | null = null;

  init(mo: any, config: SlideNumberConfig = {}): void {
    this.container = mo.getContainer();
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
    if (this.container) {
      this.container.appendChild(this.slideNumberElement);
    }
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
