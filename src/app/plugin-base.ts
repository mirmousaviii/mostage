import { MoPlugin } from "../types";

/**
 * Plugin base class that provides common functionality for all plugins
 * Reduces code duplication across plugins
 */
export abstract class PluginBase implements MoPlugin {
  abstract name: string;
  protected styleElement: HTMLElement | null = null;
  protected enabled: boolean = true;

  abstract init(mo: any, config?: any): void;
  abstract destroy(): void;

  /**
   * Check if plugin is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set plugin enabled state
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if plugin is enabled and return early if not
   * This should be called at the beginning of init() method
   */
  protected checkEnabled(): boolean {
    if (!this.enabled) {
      return false;
    }
    return true;
  }

  /**
   * Inject CSS styles into the document
   * @param styles CSS content to inject
   * @param dataAttribute Unique data attribute to prevent duplicate injection
   */
  protected injectStyles(styles: string, dataAttribute: string): void {
    if (document.querySelector(`[data-mostage-${dataAttribute}]`)) return;

    this.styleElement = document.createElement("style");
    this.styleElement.setAttribute(`data-mostage-${dataAttribute}`, "true");
    this.styleElement.textContent = styles;
    document.head.appendChild(this.styleElement);
  }

  /**
   * Clean up injected styles
   */
  protected cleanupStyles(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  /**
   * Clean up DOM elements
   * @param elements Array of elements to remove
   */
  protected cleanupElements(...elements: (HTMLElement | null)[]): void {
    elements.forEach((element) => {
      if (element) {
        element.remove();
      }
    });
  }
}
