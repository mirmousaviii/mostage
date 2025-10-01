// Mostage Development Server Script

// Development server utilities
class DevServer {
  constructor() {
    this.init();
  }

  init() {
    this.addStatusIndicator();
    this.addAutoRefresh();
    this.addKeyboardShortcuts();
  }

  addStatusIndicator() {
    const statusElement = document.querySelector(".status");
    if (statusElement) {
      statusElement.innerHTML += ' <span id="server-status">🟢</span>';
    }
  }

  addAutoRefresh() {
    // Auto-refresh every 30 seconds in development
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setInterval(() => {
        this.checkServerStatus();
      }, 30000);
    }
  }

  addKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + R for refresh
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        window.location.reload();
      }

      // Ctrl/Cmd + B for build
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        this.showBuildInfo();
      }
    });
  }

  checkServerStatus() {
    fetch("/")
      .then((response) => {
        if (response.ok) {
          this.updateStatus("🟢", "Server is running");
        } else {
          this.updateStatus("🟡", "Server responding slowly");
        }
      })
      .catch(() => {
        this.updateStatus("🔴", "Server not responding");
      });
  }

  updateStatus(icon, text) {
    const statusElement = document.getElementById("server-status");
    if (statusElement) {
      statusElement.textContent = icon;
      statusElement.title = text;
    }
  }

  showBuildInfo() {
    const buildInfo = `
📦 Build Information:
• Core Library: ./src/core/
• CLI Tools: ./src/cli/
• Templates: ./src/cli/templates/
• Output: ./dist/

🔧 Build Commands:
• npm run build:core && npm run build:cli && npm run copy:templates
    `;

    alert(buildInfo);
  }
}

// Initialize development server
document.addEventListener("DOMContentLoaded", () => {
  new DevServer();
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DevServer;
}
