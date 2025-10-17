// Import types from centralized type definitions
import { SyntaxHighlighter } from "../utils/syntax-highlighter";
import { plugins } from "../services/plugin-service";
import { loadTheme } from "../services/theme-service";
import { ContentService } from "../services/content-service";
import { NavigationService } from "../services/navigation-service";
import { TransitionManager } from "../components/navigation/transition";
import { OverviewManager } from "../components/ui/overview/overview";
import { HelpManager } from "../components/ui/help/help";
import { CenterContentManager } from "../components/ui/center/center";
import { UrlHashManager } from "../components/navigation/url-hash";
import {
  MoConfig,
  MoSlide,
  MoPlugin,
  MoSlideEvent,
  MostageInstance,
  TransitionConfig,
} from "@/types";

// Global variable to preserve slide position across instances
let globalCurrentSlideIndex = 0;

/**
 * Mostage Presentation Engine
 *
 * The main class for creating and managing Mostage presentations.
 * Provides a comprehensive API for slide navigation, theming, plugins, and more.
 *
 * @example
 * ```typescript
 * import { Mostage } from 'mostage';
 *
 * const presentation = new Mostage({
 *   element: '#presentation',
 *   theme: 'dark',
 *   contentPath: './content.md'
 * });
 *
 * await presentation.start();
 * ```
 */
export class Mostage implements MostageInstance {
  private config: MoConfig;
  private container: HTMLElement;
  private slides: MoSlide[] = [];
  private currentSlideIndex = 0;
  private plugins: MoPlugin[] = [];
  private syntaxHighlighter: SyntaxHighlighter;

  // Enhanced Services
  private contentService: ContentService;
  private navigationService: NavigationService;
  private transitionManager!: TransitionManager;
  private overviewManager: OverviewManager;
  private helpManager: HelpManager;
  private centerContentManager: CenterContentManager;
  private urlHashManager!: UrlHashManager;
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * Creates a new Mostage presentation instance
   *
   * @param config - Configuration object or path to JSON config file
   * @throws {Error} When container element is not found or invalid
   * @throws {ConfigValidationError} When configuration is invalid
   */
  constructor(config: MoConfig | string) {
    // Handle string input (JSON file path)
    if (typeof config === "string") {
      this.config = {
        theme: "light",
        transition: {
          type: "horizontal",
          duration: 300,
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
        configPath: config,
      };
    } else {
      // Handle object input (inline config)
      this.config = {
        theme: "light",
        transition: {
          type: "horizontal",
          duration: 300,
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
    }

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

    // Auto-detect container mode and apply appropriate positioning
    this.applyAutoDetection();

    // Initialize services
    this.contentService = new ContentService();
    this.navigationService = new NavigationService(
      this.container,
      this.config.keyboard || false,
      this.config.touch || false,
      (index: number) => this.goToSlide(index)
    );

    // Initialize managers
    this.overviewManager = new OverviewManager(
      this.container,
      (index: number) => this.goToSlide(index),
      () => this.onExitOverview(),
      () => this.onEnterOverview()
    );
    this.helpManager = new HelpManager(this.container);
    this.centerContentManager = new CenterContentManager(this.container);

    // Initialize config-dependent managers
    this.initializeConfigDependentManagers();
  }

  /**
   * Auto-detect container mode and apply appropriate positioning
   * If parent is body -> standalone mode (absolute positioning)
   * If parent is not body -> embedded mode (relative positioning)
   */
  private applyAutoDetection(): void {
    const isStandalone = this.container === document.body;

    if (isStandalone) {
      // Standalone mode: use absolute positioning for full viewport
      this.container.style.position = "absolute";
      this.container.style.width = "100vw";
      this.container.style.height = "100vh";
      this.container.style.top = "0";
      this.container.style.left = "0";
    } else {
      // Embedded mode: use relative positioning for container
      this.container.style.position = "relative";
      this.container.style.width = "100%";
      this.container.style.height = "100%";
    }
  }

  /**
   * Initialize managers that depend on configuration values
   */
  private initializeConfigDependentManagers(): void {
    this.transitionManager = new TransitionManager(
      this.container,
      this.config.transition as TransitionConfig
    );
    this.urlHashManager = new UrlHashManager(
      this.config.urlHash || false,
      (index: number) => this.goToSlide(index)
    );
  }

  /**
   * Load configuration from a JSON file and merge it with existing config
   * @param configPath Path to the JSON configuration file
   */
  private async loadConfigFromFile(configPath: string): Promise<void> {
    try {
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(
          `Failed to load config file: ${response.status} ${response.statusText}`
        );
      }
      const jsonConfig: MoConfig = await response.json();

      // Merge the loaded config with existing config
      this.config = {
        ...this.config,
        ...jsonConfig,
      };

      // Handle legacy transition format
      if (typeof this.config.transition === "string") {
        this.config.transition = {
          type: this.config.transition as any,
          duration: 300,
          easing: "ease-in-out",
        };
      }

      // Re-initialize managers that depend on config values
      this.initializeConfigDependentManagers();
    } catch (error) {
      console.error("Failed to load configuration from file:", error);
      throw error;
    }
  }

  /**
   * Initializes and starts the presentation
   *
   * Loads content, applies theme, initializes plugins, and sets up navigation.
   * This method must be called after creating a Mostage instance.
   *
   * @throws {ContentLoadError} When content cannot be loaded
   * @throws {ThemeLoadError} When theme cannot be loaded
   * @throws {PluginLoadError} When plugins fail to load
   *
   * @example
   * ```typescript
   * const presentation = new Mostage(config);
   * await presentation.start();
   * ```
   */
  async start(): Promise<void> {
    try {
      // Load configuration from JSON file if configPath is provided
      if (this.config.configPath) {
        await this.loadConfigFromFile(this.config.configPath);
      }

      // Load theme
      if (this.config.theme) {
        await loadTheme(this.config.theme);
      }

      // Load content using enhanced service
      let content: string;

      if (this.config.content) {
        content = this.config.content;
      } else if (this.config.contentPath) {
        content = await this.contentService.loadContentFromSource(
          this.config.contentPath
        );
      } else {
        throw new Error(
          "No content provided. Please specify content or contentPath."
        );
      }

      this.slides = this.contentService.parseContent(content);

      // Initialize center content if configured
      this.centerContentManager.initialize(this.config.centerContent || null);

      // Setup navigation using enhanced service
      this.navigationService.setSlides(this.slides);
      // Setup only touch navigation from NavigationService, keyboard is handled by main engine
      if (this.config.touch) {
        this.navigationService.enableTouch();
      }

      // Setup keyboard event listener for overview and help
      if (this.config.keyboard) {
        document.addEventListener("keydown", this.handleKeyboard.bind(this));
      }

      // Setup URL hash navigation if enabled
      this.urlHashManager.setupUrlHashNavigation();

      // Determine target slide before rendering
      const urlSlide = this.urlHashManager.getInitialSlideFromUrl();
      const targetSlide = urlSlide !== 0 ? urlSlide : globalCurrentSlideIndex;

      // Set current slide index before rendering
      this.currentSlideIndex = targetSlide;

      // Render slides
      await this.renderSlides();

      // Show the target slide without transition
      this.transitionManager.showSlide(targetSlide);

      // Initialize plugins AFTER DOM is ready
      this.initializePlugins();

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
          const isEnabled = (finalConfig as any).enabled === true;

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
    // Check if focus is on an input element (textarea, input, contenteditable)
    const activeElement = document.activeElement as HTMLElement;
    const isInputFocused =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true" ||
        activeElement.isContentEditable);

    // If user is typing in an input field, don't handle keyboard navigation
    if (isInputFocused) {
      return;
    }

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
      key === "ArrowUp" ||
      key === "ArrowDown" ||
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
      case "ArrowDown":
        this.nextSlide();
        break;
      case "ArrowLeft":
      case "ArrowUp":
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

  private async renderSlides(): Promise<void> {
    this.container.innerHTML = "";

    // Create header if configured
    if (this.config.header) {
      await this.renderHeader();
    }

    // Create footer if configured
    if (this.config.footer) {
      await this.renderFooter();
    }

    const slidesContainer = document.createElement("div");
    slidesContainer.className = "mostage-slides";

    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.className = "mostage-slide";
      slideElement.id = slide.id;

      // Apply background if configured
      this.applyBackgroundToSlide(slideElement, index);

      // Create content wrapper for scaling
      const contentWrapper = document.createElement("div");
      contentWrapper.className = "mostage-slide-content";
      contentWrapper.innerHTML = slide.html;

      // Apply scale to content if specified
      if (this.config.scale !== 1.0) {
        contentWrapper.style.transform = `scale(${this.config.scale})`;
        contentWrapper.style.transformOrigin = "center center";

        // If scaling up, ensure content fits within slide boundaries
        if (this.config.scale && this.config.scale > 1.0) {
          // Calculate the inverse scale to fit the content
          const inverseScale = 1 / this.config.scale;
          contentWrapper.style.width = `${100 * inverseScale}%`;
          contentWrapper.style.height = `${100 * inverseScale}%`;
        }
      }

      slideElement.appendChild(contentWrapper);
      // Initially hide all slides, will be shown by goToSlide
      slideElement.style.display = "none";
      slidesContainer.appendChild(slideElement);
    });

    this.container.appendChild(slidesContainer);

    // Apply syntax highlighting to all slides after rendering
    this.syntaxHighlighter.highlightAll(this.container);
  }

  private applyBackgroundToSlide(
    slideElement: HTMLElement,
    slideIndex: number
  ): void {
    if (!this.config.background) return;

    const slideNumber = slideIndex + 1; // Convert 0-based index to 1-based slide number

    // Handle both single background and array of backgrounds
    const backgrounds = Array.isArray(this.config.background)
      ? this.config.background
      : [this.config.background];

    // Apply all matching backgrounds
    backgrounds.forEach((bg: any) => {
      if (this.shouldApplyBackground(bg, slideNumber)) {
        this.applyBackgroundStyles(slideElement, bg);
      }
    });
  }

  private shouldApplyBackground(bg: any, slideNumber: number): boolean {
    // Check global
    if (bg.global === true) {
      return true;
    }

    // Check allSlides (specific slides)
    if (bg.allSlides && bg.allSlides.length > 0) {
      if (bg.allSlides.includes(slideNumber)) {
        return true;
      }
    }

    // Check allSlidesExcept (works independently of global)
    if (bg.allSlidesExcept && bg.allSlidesExcept.length > 0) {
      if (!bg.allSlidesExcept.includes(slideNumber)) {
        return true;
      }
    }

    return false;
  }

  private applyBackgroundStyles(slideElement: HTMLElement, bg: any): void {
    // Apply background color if specified
    if (bg.bgColor) {
      slideElement.style.backgroundColor = bg.bgColor;
    }

    // Apply background image if specified
    if (bg.imagePath) {
      slideElement.style.backgroundImage = `url("${bg.imagePath}")`;
      slideElement.style.backgroundSize = bg.size || "cover";
      slideElement.style.backgroundPosition = bg.position || "center";
      slideElement.style.backgroundRepeat = bg.repeat || "no-repeat";
    }
  }

  private async renderHeader(): Promise<void> {
    if (!this.config.header) return;

    const headerElement = document.createElement("div");
    headerElement.className = "mostage-header";

    // Add position class
    const position = this.config.header.position || "top-center";
    headerElement.classList.add(`mostage-header-${position.replace("-", "-")}`);

    let content = "";
    if (this.config.header.content) {
      content = this.config.header.content;
    } else if (this.config.header.contentPath) {
      try {
        content = await this.contentService.loadContentFromSource(
          this.config.header.contentPath
        );
      } catch (error) {
        console.error("Failed to load header content:", error);
        return;
      }
    }

    if (content) {
      // Parse markdown content if it's markdown
      if (
        content.includes("#") ||
        content.includes("*") ||
        content.includes("`")
      ) {
        const parsedContent = this.contentService.parseMarkdownToHtml(content);
        headerElement.innerHTML = parsedContent;
      } else {
        headerElement.innerHTML = content;
      }
    }

    this.container.appendChild(headerElement);

    // Hide header on first slide if showOnFirstSlide is false (default behavior)
    if (
      this.currentSlideIndex === 0 &&
      this.config.header.showOnFirstSlide !== true
    ) {
      headerElement.style.display = "none";
    }
  }

  private async renderFooter(): Promise<void> {
    if (!this.config.footer) return;

    const footerElement = document.createElement("div");
    footerElement.className = "mostage-footer";

    // Add position class
    const position = this.config.footer.position || "bottom-left";
    footerElement.classList.add(`mostage-footer-${position.replace("-", "-")}`);

    let content = "";
    if (this.config.footer.content) {
      content = this.config.footer.content;
    } else if (this.config.footer.contentPath) {
      try {
        content = await this.contentService.loadContentFromSource(
          this.config.footer.contentPath
        );
      } catch (error) {
        console.error("Failed to load footer content:", error);
        return;
      }
    }

    if (content) {
      // Parse markdown content if it's markdown
      if (
        content.includes("#") ||
        content.includes("*") ||
        content.includes("`")
      ) {
        const parsedContent = this.contentService.parseMarkdownToHtml(content);
        footerElement.innerHTML = parsedContent;
      } else {
        footerElement.innerHTML = content;
      }
    }

    this.container.appendChild(footerElement);

    // Hide footer on first slide if showOnFirstSlide is false (default behavior)
    if (
      this.currentSlideIndex === 0 &&
      this.config.footer.showOnFirstSlide !== true
    ) {
      footerElement.style.display = "none";
    }
  }

  private updateHeaderFooterVisibility(): void {
    // Update header visibility
    if (this.config.header) {
      const headerElement = this.container.querySelector(
        ".mostage-header"
      ) as HTMLElement;
      if (headerElement) {
        if (
          this.currentSlideIndex === 0 &&
          this.config.header.showOnFirstSlide !== true
        ) {
          headerElement.style.display = "none";
        } else {
          headerElement.style.display = "block";
        }
      }
    }

    // Update footer visibility
    if (this.config.footer) {
      const footerElement = this.container.querySelector(
        ".mostage-footer"
      ) as HTMLElement;
      if (footerElement) {
        if (
          this.currentSlideIndex === 0 &&
          this.config.footer.showOnFirstSlide !== true
        ) {
          footerElement.style.display = "none";
        } else {
          footerElement.style.display = "block";
        }
      }
    }
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

    // Update global slide index to preserve position across instances
    globalCurrentSlideIndex = index;

    // Update URL hash if enabled
    this.urlHashManager.updateUrlHash(index, this.slides.length);

    if (previousIndex === index) {
      this.transitionManager.showSlide(index);
    } else {
      this.transitionManager.animateTransition(previousIndex, index);
    }

    // Update center content
    this.centerContentManager.onSlideChange();

    // Update header and footer visibility
    this.updateHeaderFooterVisibility();

    // Update navigation service
    this.navigationService.setCurrentSlideIndex(index);
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
  /**
   * Gets the current slide index (0-based)
   * @returns Current slide index
   */
  getCurrentSlide(): number {
    return this.currentSlideIndex;
  }

  /**
   * Gets the total number of slides
   * @returns Total number of slides
   */
  getTotalSlides(): number {
    return this.slides.length;
  }

  /**
   * Gets all slides
   * @returns Array of all slides
   */
  getSlides(): MoSlide[] {
    return this.slides;
  }

  /**
   * Gets the presentation container element
   * @returns The container HTMLElement
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  // Overview control
  toggleOverview(): void {
    this.overviewManager.toggleOverview();
  }

  // Cleanup
  destroy(): void {
    // Clean up plugins
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

    // Clean up services
    this.navigationService.destroy();
    this.contentService.clearCache();

    // Clean up managers
    this.centerContentManager.cleanup();
  }
}
