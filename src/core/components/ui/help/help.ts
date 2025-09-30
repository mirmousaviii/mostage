// Help System - Domain-Driven Design
// Everything in one file

export interface HelpItem {
  description: string;
  keys: string[];
}

export interface HelpSection {
  title: string;
  items: HelpItem[];
}

export type HelpMode = "normal" | "overview";

// Help data
const HELP_DATA = {
  overview: [
    {
      title: "Keyboard Shortcuts",
      items: [
        { description: "Navigate", keys: ["←", "→"] },
        { description: "Select", keys: ["Enter"] },
        { description: "First slide", keys: ["Home"] },
        { description: "Last slide", keys: ["End"] },
        { description: "Exit", keys: ["Esc", "O"] },
      ],
    },
  ],
  normal: [
    {
      title: "Navigation",
      items: [
        { description: "Next slide", keys: ["→", "Space"] },
        { description: "Previous slide", keys: ["←"] },
        { description: "First slide", keys: ["Home"] },
        { description: "Last slide", keys: ["End"] },
      ],
    },
    {
      title: "Modes",
      items: [
        { description: "Overview mode", keys: ["O", "Esc"] },
        { description: "Help", keys: ["H", "?"] },
      ],
    },
  ],
} as const;

// HelpComponent - Help rendering component
export class HelpComponent {
  private mode: HelpMode;
  private sections: HelpSection[];
  private prefix: string;

  constructor(mode: HelpMode) {
    this.mode = mode;
    this.prefix =
      mode === "overview" ? "mostage-overview-help" : "mostage-help";
    this.sections = JSON.parse(JSON.stringify(HELP_DATA[mode]));
  }

  createHelpElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = this.prefix;
    container.innerHTML = this.generateHTML();
    return container;
  }

  private generateHTML(): string {
    if (this.mode === "overview") {
      const section = this.sections[0];
      return `
        <div class="${this.prefix}-content">
          <div class="${this.prefix}-header">
            <h3>${section.title}</h3>
            <button class="${this.prefix}-close">×</button>
          </div>
          <div class="${this.prefix}-body">
            ${this.renderItems(section.items)}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="${this.prefix}-content">
          <div class="${this.prefix}-header">
            <h3>Keyboard Shortcuts</h3>
            <button class="${this.prefix}-close">×</button>
          </div>
          <div class="${this.prefix}-body">
            ${this.sections.map((section) => this.renderSection(section)).join("")}
          </div>
        </div>
      `;
    }
  }

  private renderSection(section: HelpSection): string {
    return `
      <div class="${this.prefix}-section">
        <h4>${section.title}</h4>
        ${this.renderItems(section.items)}
      </div>
    `;
  }

  private renderItems(items: HelpItem[]): string {
    return items.map((item) => this.renderItem(item)).join("");
  }

  private renderItem(item: HelpItem): string {
    return `
      <div class="${this.prefix}-item">
        <span class="${this.prefix}-description">${item.description}</span>
        ${this.renderKeys(item.keys)}
      </div>
    `;
  }

  private renderKeys(keys: string[]): string {
    if (keys.length === 1) {
      return `<span class="${this.prefix}-key">${keys[0]}</span>`;
    }
    return `
      <div class="${this.prefix}-keys">
        ${keys.map((key) => `<span class="${this.prefix}-key">${key}</span>`).join("")}
      </div>
    `;
  }

  addCloseButtonListener(element: HTMLElement, onClose: () => void): void {
    const closeButton = element.querySelector(`.${this.prefix}-close`);
    closeButton?.addEventListener("click", onClose);
  }
}

// HelpManager - Help visibility management
export class HelpManager {
  private isHelpVisible = false;
  private helpContainer: HTMLElement | null = null;
  private wasHelpVisibleBeforeOverview = false;
  private helpComponent: HelpComponent;
  private autoHideTimeout: number | null = null;

  constructor() {
    this.helpComponent = new HelpComponent("normal");
  }

  toggleHelp(): void {
    if (this.isHelpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  // Show help on initial load with auto-hide after 3 seconds
  showInitialHelp(): void {
    this.showHelp();
    this.scheduleAutoHide();
  }

  // Schedule auto-hide after 5 seconds
  private scheduleAutoHide(): void {
    this.clearAutoHide();
    this.autoHideTimeout = window.setTimeout(() => {
      this.hideHelp();
    }, 3000);
  }

  // Clear auto-hide timeout
  private clearAutoHide(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
  }

  getHelpVisible(): boolean {
    return this.isHelpVisible;
  }

  hideForOverview(): void {
    if (this.isHelpVisible) {
      this.wasHelpVisibleBeforeOverview = true;
      this.hideHelp();
    } else {
      this.wasHelpVisibleBeforeOverview = false;
    }
  }

  restoreAfterOverview(): void {
    if (this.wasHelpVisibleBeforeOverview) {
      this.showHelp();
      this.wasHelpVisibleBeforeOverview = false;
    }
  }

  private showHelp(): void {
    if (this.isHelpVisible) return;

    this.isHelpVisible = true;
    this.helpContainer = this.createHelpComponent();
    document.body.appendChild(this.helpContainer);

    // Trigger fade-in animation
    requestAnimationFrame(() => {
      if (this.helpContainer) {
        this.helpContainer.classList.add("fade-in");
      }
    });
  }

  private hideHelp(): void {
    if (!this.isHelpVisible) return;

    this.isHelpVisible = false;
    this.clearAutoHide(); // Clear any pending auto-hide
    this.hideHelpWithAnimation();
  }

  // Hide help with fade-out animation
  private hideHelpWithAnimation(): void {
    if (!this.helpContainer) return;

    // Add fade-out class for animation
    this.helpContainer.classList.add("fade-out");
    this.helpContainer.classList.remove("fade-in");

    // Wait for animation to complete, then remove element
    setTimeout(() => {
      if (this.helpContainer) {
        this.helpContainer.remove();
        this.helpContainer = null;
      }
    }, 300); // Match CSS transition duration
  }

  private createHelpComponent(): HTMLElement {
    const helpContainer = this.helpComponent.createHelpElement();

    // Add close button event listener
    this.helpComponent.addCloseButtonListener(helpContainer, () => {
      this.hideHelp();
    });

    return helpContainer;
  }
}
