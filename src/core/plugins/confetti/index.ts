import { PluginBase } from "../../plugin-base";
import styles from "./style.css?inline";

export interface ConfettiConfig {
  enabled?: boolean;
  particleCount?: number;
  colors?: string[];
  size?: {
    min?: number;
    max?: number;
  };
  duration?: number;
  delay?: number;
}

export class ConfettiPlugin extends PluginBase {
  name = "Confetti";
  private confettiContainer: HTMLElement | null = null;
  private mo: any;
  private confettiSlides: Set<number> = new Set();
  private config!: ConfettiConfig;

  init(mo: any, config: ConfettiConfig = {}): void {
    this.mo = mo;
    this.config = {
      enabled: true,
      particleCount: 50,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
      ],
      size: {
        min: 5,
        max: 15,
      },
      duration: 4000,
      delay: 50,
      ...config,
    };

    // Check if plugin is enabled
    if (!this.checkEnabled()) {
      return;
    }

    this.injectStyles(styles, "confetti-styles");
    this.createConfettiContainer();
    this.parseSlidesForConfetti();
    this.setupSlideListener();
  }

  private createConfettiContainer(): void {
    this.confettiContainer = document.createElement("div");
    this.confettiContainer.className = "mostage-confetti-container";
    this.confettiContainer.style.pointerEvents = "none";
    document.body.appendChild(this.confettiContainer);
  }

  private parseSlidesForConfetti(): void {
    const slides = this.mo.getSlides();
    slides.forEach((slide: any, index: number) => {
      // Check for confetti comments
      if (slide.content.includes("<!-- confetti -->")) {
        this.confettiSlides.add(index);
      }
    });
  }

  private setupSlideListener(): void {
    this.mo.on("slidechange", (event: any) => {
      const currentSlide = event.currentSlide;
      if (this.confettiSlides.has(currentSlide)) {
        // Wait for slide transition to complete, then add a small delay
        const transitionDuration = this.mo.config.transition?.duration || 300;
        const delay = transitionDuration + (this.config.delay || 100);

        setTimeout(() => {
          this.triggerConfetti();
        }, delay);
      }
    });
  }

  private triggerConfetti(): void {
    if (!this.confettiContainer || !this.config.enabled) return;

    // Clear any existing confetti
    this.confettiContainer.innerHTML = "";

    // Create confetti particles
    for (let i = 0; i < (this.config.particleCount || 50); i++) {
      this.createConfettiParticle();
    }

    // Clean up after animation
    setTimeout(() => {
      if (this.confettiContainer) {
        this.confettiContainer.innerHTML = "";
      }
    }, this.config.duration || 3000);
  }

  private createConfettiParticle(): void {
    if (!this.confettiContainer) return;

    const particle = document.createElement("div");
    particle.className = "mostage-confetti-particle";

    // Random properties
    const colors = this.config.colors || [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const minSize = this.config.size?.min || 5;
    const maxSize = this.config.size?.max || 15;
    const size = Math.random() * (maxSize - minSize) + minSize;
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() - 0.5) * 200; // -100 to +100 from start
    const rotation = Math.random() * 360;
    const rotationSpeed = (Math.random() - 0.5) * 720; // -360 to +360 degrees
    const fallSpeed = Math.random() * 2 + 1; // 1-3 seconds

    // Set particle properties
    particle.style.backgroundColor = color;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = "-10px";
    particle.style.transform = `rotate(${rotation}deg)`;
    particle.style.animationDuration = `${fallSpeed}s`;

    // Add particle to container
    this.confettiContainer.appendChild(particle);

    // Animate particle
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${endX - startX}px, ${window.innerHeight + 20}px) rotate(${rotation + rotationSpeed}deg)`;
    });
  }

  destroy(): void {
    this.cleanupElements(this.confettiContainer);
    this.cleanupStyles();
    this.confettiContainer = null;
  }
}

export default ConfettiPlugin;
