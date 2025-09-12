import { MoPlugin } from "../../types";
import styles from "./style.css?inline";

export class ConfettiPlugin implements MoPlugin {
  name = "Confetti";
  private confettiContainer: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private mo: any;
  private confettiSlides: Set<number> = new Set();

  init(mo: any): void {
    this.mo = mo;

    this.injectStyles();
    this.createConfettiContainer();
    this.parseSlidesForConfetti();
    this.setupSlideListener();
  }

  private injectStyles(): void {
    if (document.querySelector("[data-mostage-confetti-styles]")) return;

    this.styleElement = document.createElement("style");
    this.styleElement.setAttribute("data-mostage-confetti-styles", "true");
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
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
      // Check for confetti comments in markdown
      if (slide.content.includes("<!-- confetti -->")) {
        this.confettiSlides.add(index);
        console.log(
          `Confetti enabled for slide ${index}: ${slide.content.substring(0, 50)}...`
        );
      }
    });
  }

  private setupSlideListener(): void {
    this.mo.on("slidechange", (event: any) => {
      const currentSlide = event.currentSlide;
      if (this.confettiSlides.has(currentSlide)) {
        // Wait for slide transition to complete, then add a small delay
        const transitionDuration = this.mo.config.transition?.duration || 600;
        const delay = transitionDuration + 100; // 0.1 second after transition completes

        setTimeout(() => {
          this.triggerConfetti();
        }, delay);
      }
    });
  }

  private triggerConfetti(): void {
    if (!this.confettiContainer) return;

    // Clear any existing confetti
    this.confettiContainer.innerHTML = "";

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      this.createConfettiParticle();
    }

    // Clean up after animation
    setTimeout(() => {
      if (this.confettiContainer) {
        this.confettiContainer.innerHTML = "";
      }
    }, 3000);
  }

  private createConfettiParticle(): void {
    if (!this.confettiContainer) return;

    const particle = document.createElement("div");
    particle.className = "mostage-confetti-particle";

    // Random properties
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5; // 5-15px
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
    if (this.confettiContainer) {
      this.confettiContainer.remove();
      this.confettiContainer = null;
    }
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}

export default ConfettiPlugin;
