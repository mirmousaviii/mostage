import { ProjectOptions, ConfigContent } from "../commands/init";
import { PLUGIN_CONFIGS, DEFAULT_VALUES } from "../utils/constants";

export class ConfigBuilder {
  static buildPluginsConfig(plugins: string[]): Record<string, any> {
    const pluginsConfig: Record<string, any> = {};

    if (plugins && plugins.length > 0) {
      plugins.forEach((plugin) => {
        if (PLUGIN_CONFIGS[plugin as keyof typeof PLUGIN_CONFIGS]) {
          pluginsConfig[plugin] = {
            ...PLUGIN_CONFIGS[plugin as keyof typeof PLUGIN_CONFIGS],
            enabled: true,
          };
        }
      });
    }

    return pluginsConfig;
  }

  static buildConfigContent(options: ProjectOptions): ConfigContent {
    const pluginsConfig = this.buildPluginsConfig(options.plugins);

    return {
      element: "#app",
      theme: options.theme || DEFAULT_VALUES.theme,
      contentPath: options.contentPath || DEFAULT_VALUES.contentPath,
      scale: 1.0,
      transition: {
        type: options.transition || DEFAULT_VALUES.transition,
        easing: "ease-in-out",
      },
      urlHash:
        options.urlHash !== undefined
          ? options.urlHash
          : DEFAULT_VALUES.urlHash,
      centerContent: {
        vertical:
          options.centerVertical !== undefined
            ? options.centerVertical
            : DEFAULT_VALUES.centerVertical,
        horizontal:
          options.centerHorizontal !== undefined
            ? options.centerHorizontal
            : DEFAULT_VALUES.centerHorizontal,
      },
      header: {
        content: "",
        position: "top-left",
        showOnFirstSlide: false,
      },
      footer: {
        content: "",
        position: "bottom-left",
        showOnFirstSlide: true,
      },
      plugins: pluginsConfig,
    };
  }
}
