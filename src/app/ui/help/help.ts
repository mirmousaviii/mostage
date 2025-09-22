export class HelpManager {
  private isHelpVisible = false;
  private helpContainer: HTMLElement | null = null;
  private wasHelpVisibleBeforeOverview = false;

  toggleHelp(): void {
    if (this.isHelpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
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
  }

  private hideHelp(): void {
    if (!this.isHelpVisible) return;

    this.isHelpVisible = false;
    if (this.helpContainer) {
      this.helpContainer.remove();
      this.helpContainer = null;
    }
  }

  private createHelpComponent(): HTMLElement {
    const helpContainer = document.createElement("div");
    helpContainer.className = "mostage-help";

    helpContainer.innerHTML = `
      <div class="mostage-help-content">
        <div class="mostage-help-header">
          <h3>Keyboard Shortcuts</h3>
          <button class="mostage-help-close">×</button>
        </div>
        <div class="mostage-help-body">
          <div class="mostage-help-section">
            <h4>Navigation</h4>
            <div class="mostage-help-item">
              <span class="mostage-help-description">Next slide</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">→</span>
                <span class="mostage-help-key">Space</span>
              </div>
            </div>
            <div class="mostage-help-item">
              <span class="mostage-help-description">Previous slide</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">←</span>
              </div>
            </div>
            <div class="mostage-help-item">
              <span class="mostage-help-description">First slide</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">Home</span>
              </div>
            </div>
            <div class="mostage-help-item">
              <span class="mostage-help-description">Last slide</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">End</span>
              </div>
            </div>
          </div>
          <div class="mostage-help-section">
            <h4>Modes</h4>
            <div class="mostage-help-item">
              <span class="mostage-help-description">Overview mode</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">O</span>
                <span class="mostage-help-key">Esc</span>
              </div>
            </div>
            <div class="mostage-help-item">
              <span class="mostage-help-description">Help</span>
              <div class="mostage-help-keys">
                <span class="mostage-help-key">H</span>
                <span class="mostage-help-key">?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add close button event listener
    const closeButton = helpContainer.querySelector(".mostage-help-close");
    closeButton?.addEventListener("click", () => {
      this.hideHelp();
    });

    return helpContainer;
  }
}
