import { NewOptions, NewError } from "../commands/new";
import { TEMPLATES, THEME_CHOICES, TRANSITION_CHOICES } from "./constants";

export class ProjectValidator {
  static validateOptions(options: NewOptions): void {
    // Template validation removed for init command (always uses custom)

    if (
      options.theme &&
      !THEME_CHOICES.some((theme) => theme.value === options.theme)
    ) {
      throw new NewError(
        `Invalid theme: ${options.theme}. Available themes: ${THEME_CHOICES.map((t) => t.value).join(", ")}`,
        "INVALID_THEME"
      );
    }

    if (
      options.transition &&
      !TRANSITION_CHOICES.some(
        (transition) => transition.value === options.transition
      )
    ) {
      throw new NewError(
        `Invalid transition: ${options.transition}. Available transitions: ${TRANSITION_CHOICES.map((t) => t.value).join(", ")}`,
        "INVALID_TRANSITION"
      );
    }

    if (options.plugins) {
      const validPlugins = [
        "ProgressBar",
        "SlideNumber",
        "Controller",
        "Confetti",
      ];
      const providedPlugins = options.plugins.split(",").map((p) => p.trim());
      const invalidPlugins = providedPlugins.filter(
        (plugin) => !validPlugins.includes(plugin)
      );

      if (invalidPlugins.length > 0) {
        throw new NewError(
          `Invalid plugins: ${invalidPlugins.join(", ")}. Available plugins: ${validPlugins.join(", ")}`,
          "INVALID_PLUGINS"
        );
      }
    }
  }

  static validatePath(path: string, fieldName: string): void {
    if (!path || !path.trim()) {
      throw new NewError(`${fieldName} path is required`, "MISSING_PATH");
    }
  }

  static validateContentPath(input: string): boolean {
    if (!input.trim()) {
      return false;
    }
    return true;
  }
}
