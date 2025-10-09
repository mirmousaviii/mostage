import { PluginBase } from "@/core/plugin-base";
import styles from "./style.css?inline";

export interface ProgressBarConfig {
  enabled?: boolean;
  position?: "top" | "bottom";
  color?: string;
  height?: string;
}

export class ProgressBarPlugin extends PluginBase {
  name = "ProgressBar";
  private progressBar: HTMLElement | null = null;
  private config!: ProgressBarConfig;

  init(mo: any, config: ProgressBarConfig = {}): void {
    this.config = {
      enabled: true,
      position: "bottom",
      color: "#007acc",
      height: "12px",
      ...config,
    };

    // Check if plugin is enabled
    if (!this.checkEnabled()) {
      return;
    }

    this.injectStyles(styles, "progress-styles");
    this.createProgressBar();
    this.updateProgress(mo.getCurrentSlide(), mo.getTotalSlides());

    mo.on("slidechange", (event: any) => {
      this.updateProgress(event.currentSlide, event.totalSlides);
    });
  }

  private createProgressBar(): void {
    this.progressBar = document.createElement("div");
    this.progressBar.className = `mostage-progress-bar mostage-progress-${this.config.position}`;
    this.progressBar.innerHTML = '<div class="mostage-progress-fill"></div>';

    // Apply custom styles
    this.progressBar.style.backgroundColor = "rgba(0,0,0,0.1)";
    this.progressBar.style.height = this.config.height!;

    const fill = this.progressBar.querySelector(
      ".mostage-progress-fill"
    ) as HTMLElement;
    if (fill) {
      fill.style.backgroundColor = this.config.color!;
      fill.style.height = "100%";
    }

    document.body.appendChild(this.progressBar);
  }

  private updateProgress(current: number, total: number): void {
    if (!this.progressBar) return;

    const fill = this.progressBar.querySelector(
      ".mostage-progress-fill"
    ) as HTMLElement;
    if (fill) {
      const percentage = ((current + 1) / total) * 100;
      fill.style.width = `${percentage}%`;
    }
  }

  destroy(): void {
    this.cleanupElements(this.progressBar);
    this.cleanupStyles();
    this.progressBar = null;
  }
}

export default ProgressBarPlugin;
