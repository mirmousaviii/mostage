/**
 * Mostage Services
 *
 * Centralized service layer for the Mostage presentation framework.
 * This barrel export provides all services in one place.
 */

// Core services
export { ContentService } from "./content-service";
export { ConfigService } from "./config-service";
export { ThemeService } from "./theme-service";
export { PluginService } from "./plugin-service";
export { NavigationService } from "./navigation-service";

// Service utilities and helpers
export { plugins } from "./plugin-service";
export { themes, loadTheme, getAvailableThemes } from "./theme-service";
