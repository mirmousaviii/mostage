/**
 * Mostage Core - Central management for all core functionality
 * 
 * This module provides centralized access to all core components:
 * - Main Mo class
 * - Plugin loading and management
 * - Theme loading and styling
 * - Event system
 */

export { Mostage } from './mostage';
export { PluginLoader } from './plugin-loader';
export { ThemeLoader, type Theme } from './theme-loader';

// Re-export commonly used functions for convenience
export { plugins } from './plugin-loader';
export { themes, loadTheme, getAvailableThemes } from './theme-loader';

// Backward compatibility (deprecated)
export { Mostage as Mo } from './mostage';
