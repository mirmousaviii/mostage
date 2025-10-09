import { MoPlugin } from "@/types";

/**
 * Enhanced Plugin Service - Auto-discovers and manages all plugins
 * Provides comprehensive plugin management with better error handling
 */
export class PluginService {
  private static plugins: Record<string, new () => MoPlugin> = {};
  private static loadedPlugins: Map<string, MoPlugin> = new Map();
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

  /**
   * Load a plugin with configuration
   */
  static async loadPlugin(name: string): Promise<MoPlugin> {
    try {
      const PluginClass = this.getPlugin(name);
      if (!PluginClass) {
        throw new PluginNotFoundError(`Plugin '${name}' not found`);
      }

      const plugin = new PluginClass();

      // Store the loaded plugin
      this.loadedPlugins.set(name, plugin);

      return plugin;
    } catch (error) {
      throw new PluginLoadError(
        `Failed to load plugin '${name}': ${error instanceof Error ? error.message : "Unknown error"}`,
        name
      );
    }
  }

  /**
   * Unload a plugin
   */
  static unloadPlugin(name: string): void {
    const plugin = this.loadedPlugins.get(name);
    if (plugin) {
      try {
        if (plugin.destroy) {
          plugin.destroy();
        }
        this.loadedPlugins.delete(name);
      } catch (error) {
        console.error(`Error destroying plugin '${name}':`, error);
      }
    }
  }

  /**
   * Get all loaded plugins
   */
  static getLoadedPlugins(): MoPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Check if a plugin is loaded
   */
  static isPluginLoaded(name: string): boolean {
    return this.loadedPlugins.has(name);
  }

  /**
   * Enable a plugin
   */
  static enablePlugin(name: string): void {
    const plugin = this.loadedPlugins.get(name);
    if (plugin && plugin.setEnabled) {
      plugin.setEnabled(true);
    }
  }

  /**
   * Disable a plugin
   */
  static disablePlugin(name: string): void {
    const plugin = this.loadedPlugins.get(name);
    if (plugin && plugin.setEnabled) {
      plugin.setEnabled(false);
    }
  }

  /**
   * Get plugin statistics
   */
  static getPluginStats(): {
    total: number;
    loaded: number;
    available: string[];
  } {
    return {
      total: Object.keys(this.plugins).length,
      loaded: this.loadedPlugins.size,
      available: Object.keys(this.plugins),
    };
  }
}

/**
 * Custom error classes for plugin operations
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PluginLoadError extends PluginError {
  constructor(
    message: string,
    public readonly pluginName: string
  ) {
    super(message, "PLUGIN_LOAD_ERROR");
  }
}

export class PluginNotFoundError extends PluginError {
  constructor(pluginName: string) {
    super(`Plugin '${pluginName}' not found`, "PLUGIN_NOT_FOUND");
  }
}

// Auto-initialize and export plugins for backward compatibility
export const plugins = PluginService.initialize();
