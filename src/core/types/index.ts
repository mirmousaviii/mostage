/**
 * Mostage Type Definitions
 *
 * Centralized type definitions for the Mostage presentation framework.
 * This barrel export provides all type definitions in one place.
 */

// Re-export core types (excluding service interfaces to avoid conflicts)
export type {
  MoConfig,
  MoSlide,
  MoPlugin,
  MoSlideEvent,
  MostageInstance,
  TransitionConfig,
  MoTheme,
  CenterContentConfig,
  HeaderConfig,
  PluginsConfig,
  MostageTestAccess,
  PluginTestAccess,
} from "./core.types";

// Re-export configuration types
export * from "./config.types";

// Re-export plugin types
export * from "./plugin.types";

// Re-export theme types
export * from "./theme.types";
