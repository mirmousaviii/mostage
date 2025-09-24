import { MoPlugin } from "../types";

/**
 * Plugin Loader - Auto-discovers and registers all plugins
 * Automatically loads all plugins from the plugins directory structure
 */
export class PluginLoader {
  private static plugins: Record<string, new () => MoPlugin> = {};
  private static initialized = false;

  /**
   * Initialize plugin auto-discovery system
   */
  static initialize() {
    if (this.initialized) return this.plugins;

    // Dynamic plugin discovery - automatically loads all plugins from subdirectories
    const pluginContext = import.meta.glob("../plugins/*/index.ts", {
      eager: true,
    });

    // Auto-register all discovered plugins
    Object.entries(pluginContext).forEach(([path, module]) => {
      const exports = module as any;

      // Find the plugin class (default export or named export ending with 'Plugin')
      const PluginClass =
        exports.default ||
        Object.values(exports).find(
          (exp: any) =>
            typeof exp === "function" && exp.name && exp.name.endsWith("Plugin")
        );

      if (PluginClass && typeof PluginClass === "function") {
        try {
          const instance = new (PluginClass as new () => MoPlugin)();
          this.plugins[instance.name] = PluginClass as new () => MoPlugin;
        } catch (error) {
          console.warn(`Failed to register plugin from ${path}:`, error);
        }
      }
    });

    this.initialized = true;
    return this.plugins;
  }

  /**
   * Get all registered plugins
   */
  static getPlugins(): Record<string, new () => MoPlugin> {
    if (!this.initialized) {
      this.initialize();
    }
    return this.plugins;
  }

  /**
   * Get a specific plugin by name
   */
  static getPlugin(name: string): (new () => MoPlugin) | undefined {
    const plugins = this.getPlugins();
    return plugins[name];
  }

  /**
   * Get list of available plugin names
   */
  static getAvailablePlugins(): string[] {
    return Object.keys(this.getPlugins());
  }
}

// Auto-initialize and export plugins for backward compatibility
export const plugins = PluginLoader.initialize();
