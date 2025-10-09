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

// Main engine export
export { Mostage } from "./engine/mostage-engine";
export { Mostage as default } from "./engine/mostage-engine";

// Re-export all types
export * from "./types";

// Re-export all services
export * from "./services";

// Re-export all components
export * from "./components";

// Re-export all plugins
export * from "./plugins";

// Re-export all utilities
export * from "./utils";
