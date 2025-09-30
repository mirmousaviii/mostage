/**
 * Mostage Core - Central management for all core functionality
 *
 * This module provides centralized access to all core components:
 * - Main Mo class
 * - Plugin loading and management
 * - Theme loading and styling
 * - Event system
 */

// Import styles
import "./styles/foundation/index.css";

export { Mostage } from "./engine/mostage-engine";
export type { Theme } from "./types";

// Export services
export { ContentService } from "./services/content-service";
export { ThemeService } from "./services/theme-service";
export { PluginService } from "./services/plugin-service";
export { NavigationService } from "./services/navigation-service";
export { ConfigService } from "./services/config-service";

// Export components
export { TransitionManager } from "./components/navigation/transition";
export { OverviewManager } from "./components/ui/overview/overview";
export { HelpManager } from "./components/ui/help/help";
export { UrlHashManager } from "./components/navigation/url-hash";

// Re-export commonly used functions for convenience
export { plugins } from "./services/plugin-service";
export {
  themes,
  loadTheme,
  getAvailableThemes,
} from "./services/theme-service";

// Alias for convenience
export { Mostage as Mo } from "./engine/mostage-engine";
