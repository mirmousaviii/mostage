import {
  MoConfig,
  MoPlugin,
  MoSlide,
  MoSlideEvent,
  TransitionConfig,
} from "../types";
import { SyntaxHighlighter } from "../utils/syntax-highlighter";
import { plugins } from "./plugin-loader";
import { loadTheme } from "./theme-loader";
import { ContentManager } from "./content-manager";
import { NavigationManager } from "./navigation/navigation";
import { TransitionManager } from "./navigation/transition";
import { OverviewManager } from "./ui/overview/overview";
import { HelpManager } from "./ui/help/help";
import { CenterContentManager } from "./ui/center/center";
import { UrlHashManager } from "./navigation/url-hash";

export class Mostage {
  private config: MoConfig;
  private container: HTMLElement;
  private slides: MoSlide[] = [];
  private currentSlideIndex = 0;
  private plugins: MoPlugin[] = [];
  private syntaxHighlighter: SyntaxHighlighter;

  // Managers
  private contentManager: ContentManager;
  private navigationManager: NavigationManager;
  private transitionManager: TransitionManager;
  private overviewManager: OverviewManager;
  private helpManager: HelpManager;
  private centerContentManager: CenterContentManager;
  private urlHashManager: UrlHashManager;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: MoConfig) {
    this.config = {
      theme: "light",
      transition: {
        type: "horizontal",
        duration: 600,
        easing: "ease-in-out",
      },
      scale: 1.0,
      loop: false,
      plugins: {},
      keyboard: true,
      touch: true,
      urlHash: false,
      centerContent: {
        vertical: true,
        horizontal: true,
      },
      ...config,
    };

    // Handle legacy transition format
    if (typeof this.config.transition === "string") {
      this.config.transition = {
        type: this.config.transition as any,
        duration: 600,
        easing: "ease-in-out",
      };
    }

    this.syntaxHighlighter = SyntaxHighlighter.getInstance();
    this.container = this.resolveElement(this.config.element || document.body);
    this.container.classList.add("mostage-container");

    // Apply scale if specified
    if (this.config.scale !== 1.0) {
      this.container.style.transform = `scale(${this.config.scale})`;
    }

    // Initialize managers
    this.contentManager = new ContentManager();
    this.navigationManager = new NavigationManager(
      this.container,
      this.config.keyboard || false,
      this.config.touch || false,
      (index: number) => this.goToSlide(index)
    );
    this.transitionManager = new TransitionManager(
      this.container,
      this.config.transition as TransitionConfig
    );
    this.overviewManager = new OverviewManager(
      this.container,
      (index: number) => this.goToSlide(index),
      () => this.onExitOverview(),
      () => this.onEnterOverview()
    );
    this.helpManager = new HelpManager();
    this.centerContentManager = new CenterContentManager(this.container);
    this.urlHashManager = new UrlHashManager(
      this.config.urlHash || false,
      (index: number) => this.goToSlide(index)
    );
  }

  async start(): Promise<void> {
    try {
      // Load theme
      if (this.config.theme) {
        await loadTheme(this.config.theme);
      }

      // Load content
      const contentType = this.config.contentType || "markdown";
      let content: string;

      if (this.config.contentData) {
        content = this.config.contentData;
      } else if (this.config.contentSource) {
        content = await this.contentManager.loadContentFromSource(
          this.config.contentSource,
          contentType
        );
      } else {
        throw new Error(
          "No content provided. Please specify contentData or contentSource."
        );
      }

      this.slides = this.contentManager.parseContent(content, contentType);

      // Initialize center content if configured
      this.centerContentManager.initialize(this.config.centerContent || null);

      // Initialize plugins
      this.initializePlugins();

      // Setup navigation
      this.navigationManager.setSlides(this.slides);
      this.navigationManager.setupNavigation();

      // Setup keyboard event listener for overview and help
      if (this.config.keyboard) {
        document.addEventListener("keydown", this.handleKeyboard.bind(this));
      }

      // Setup URL hash navigation if enabled
      this.urlHashManager.setupUrlHashNavigation();

      // Render initial slide
      this.renderSlides();

      // Go to initial slide (from URL hash if available)
      const initialSlide = this.urlHashManager.getInitialSlideFromUrl();
      this.goToSlide(initialSlide);

      this.emit("ready", {
        type: "ready",
        currentSlide: this.currentSlideIndex,
        totalSlides: this.slides.length,
      });

      // Show initial help with auto-hide after 5 seconds
      this.helpManager.showInitialHelp();
    } catch (error) {
      console.error("Failed to start Mostage:", error);
      throw error;
    }
  }

  private resolveElement(element: string | HTMLElement): HTMLElement {
    if (typeof element === "string") {
      const found = document.querySelector(element) as HTMLElement;
      if (!found) {
        throw new Error(`Element "${element}" not found`);
      }
      return found;
    }
    return element;
  }

  private initializePlugins(): void {
    if (!this.config.plugins) return;

    Object.entries(this.config.plugins).forEach(
      ([pluginName, pluginConfig]) => {
        try {
          const PluginClass = plugins[pluginName];
          if (!PluginClass) {
            console.warn(
              `Plugin "${pluginName}" not found. Available plugins: ${Object.keys(plugins).join(", ")}`
            );
            return;
          }

          const pluginInstance = new PluginClass();
          const finalConfig = pluginConfig || {};

          // Check if plugin is enabled (must be explicitly true)
          const isEnabled = finalConfig.enabled === true;

          if (!isEnabled) {
            return;
          }

          // Set enabled state and initialize
          if (pluginInstance.setEnabled) {
            pluginInstance.setEnabled(true);
          }
          pluginInstance.init(this, finalConfig);
          this.plugins.push(pluginInstance);
        } catch (error) {
          console.error(`Failed to initialize plugin "${pluginName}":`, error);
        }
      }
    );
  }

  private handleKeyboard(event: KeyboardEvent): void {
    // Delegate to overview manager if in overview mode
    if (this.overviewManager.isInOverviewMode()) {
      this.overviewManager.handleOverviewKeyboard(event);
      return;
    }

    const key = event.key;
    const keyLower = key.toLowerCase();

    // Navigation keys
    if (this.isNavigationKey(key, keyLower)) {
      event.preventDefault();
      this.handleNavigationKey(key, keyLower);
      return;
    }

    // Mode switching keys
    if (this.isModeKey(keyLower)) {
      event.preventDefault();
      this.handleModeKey(keyLower);
      return;
    }
  }

  private isNavigationKey(key: string, keyLower: string): boolean {
    return (
      key === "ArrowRight" ||
      key === "ArrowLeft" ||
      key === "Home" ||
      key === "End" ||
      keyLower === " "
    );
  }

  private isModeKey(keyLower: string): boolean {
    return (
      keyLower === "escape" ||
      keyLower === "o" ||
      keyLower === "h" ||
      keyLower === "?"
    );
  }

  private handleNavigationKey(key: string, keyLower: string): void {
    switch (key) {
      case "ArrowRight":
        this.nextSlide();
        break;
      case "ArrowLeft":
        this.previousSlide();
        break;
      case "Home":
        this.goToSlide(0);
        break;
      case "End":
        this.goToSlide(this.slides.length - 1);
        break;
    }

    // Handle space key
    if (keyLower === " ") {
      this.nextSlide();
    }
  }

  private handleModeKey(keyLower: string): void {
    switch (keyLower) {
      case "escape":
      case "o":
        this.overviewManager.toggleOverview();
        break;
      case "h":
      case "?":
        this.helpManager.toggleHelp();
        break;
    }
  }

  private renderSlides(): void {
    this.container.innerHTML = "";

    const slidesContainer = document.createElement("div");
    slidesContainer.className = "mostage-slides";

    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.className = "mostage-slide";
      slideElement.id = slide.id;
      slideElement.innerHTML = slide.html;
      slideElement.style.display = index === 0 ? "block" : "none";
      slidesContainer.appendChild(slideElement);
    });

    this.container.appendChild(slidesContainer);

    // Apply syntax highlighting to all slides after rendering
    this.syntaxHighlighter.highlightAll(this.container);
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    } else if (this.config.loop) {
      this.goToSlide(0);
    }
  }

  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    } else if (this.config.loop) {
      this.goToSlide(this.slides.length - 1);
    }
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;

    const previousIndex = this.currentSlideIndex;
    this.currentSlideIndex = index;

    // Update URL hash if enabled
    this.urlHashManager.updateUrlHash(index, this.slides.length);

    if (previousIndex === index) {
      this.transitionManager.showSlide(index);
    } else {
      this.transitionManager.animateTransition(previousIndex, index);
    }

    // Update center content
    this.centerContentManager.onSlideChange();

    // Update navigation manager
    this.navigationManager.setCurrentSlideIndex(index);
    this.overviewManager.setCurrentSlideIndex(index);

    this.emit("slidechange", {
      type: "slidechange",
      currentSlide: index,
      totalSlides: this.slides.length,
      slide: this.slides[index],
    });
  }

  private onEnterOverview(): void {
    // Hide help when entering overview mode
    this.helpManager.hideForOverview();
  }

  private onExitOverview(): void {
    // Restore help if it was visible before overview mode
    this.helpManager.restoreAfterOverview();
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  emit(event: string, data: MoSlideEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Getters for plugins
  getCurrentSlide(): number {
    return this.currentSlideIndex;
  }

  getTotalSlides(): number {
    return this.slides.length;
  }

  getSlides(): MoSlide[] {
    return this.slides;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  // Overview control
  toggleOverview(): void {
    this.overviewManager.toggleOverview();
  }

  // Cleanup
  destroy(): void {
    this.plugins.forEach((plugin) => {
      try {
        if (plugin.destroy) {
          plugin.destroy();
        }
      } catch (error) {
        console.error(`Failed to destroy plugin: ${plugin.name}`, error);
      }
    });
    this.plugins = [];
    this.eventListeners.clear();

    // Clean up center content classes
    this.centerContentManager.cleanup();
  }
}
