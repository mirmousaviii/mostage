/**
 * Mostage CLI Utilities
 *
 * Centralized CLI utility functions for the Mostage presentation framework.
 * This barrel export provides all CLI utilities in one place.
 */

// CLI utilities
export { ProjectValidator } from "./validators";
export { InteractivePrompts } from "./prompts";

// Constants and configuration
export {
  THEME_CHOICES,
  PLUGIN_CHOICES,
  TRANSITION_CHOICES,
  EXAMPLE_TEMPLATE_CHOICES,
  DEFAULT_VALUES,
  PLUGIN_CONFIGS,
} from "./constants";
