/**
 * Mostage Plugins
 *
 * Centralized plugin system for the Mostage presentation framework.
 * This barrel export provides all built-in plugins in one place.
 */

// Built-in plugins
export { ConfettiPlugin } from "./confetti";
export { ControllerPlugin } from "./controller";
export { ProgressBarPlugin } from "./progress-bar";
export { SlideNumberPlugin } from "./slide-number";

// Plugin base class
export { PluginBase } from "@/core/plugin-base";
