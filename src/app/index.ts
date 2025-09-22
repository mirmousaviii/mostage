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
import "./foundation-styles/index.css";

export { Mostage } from "./mostage";
export { PluginLoader } from "./plugin-loader";
export { ThemeLoader, type Theme } from "./theme-loader";

// Export managers
export { ContentManager } from "./content-manager";
export { NavigationManager } from "./navigation/navigation";
export { TransitionManager } from "./navigation/transition";
export { OverviewManager } from "./ui/overview/overview";
export { HelpManager } from "./ui/help/help";
export { CenterContentManager } from "./ui/center/center";
export { UrlHashManager } from "./navigation/url-hash";

// Re-export commonly used functions for convenience
export { plugins } from "./plugin-loader";
export { themes, loadTheme, getAvailableThemes } from "./theme-loader";

// Backward compatibility (deprecated)
export { Mostage as Mo } from "./mostage";
