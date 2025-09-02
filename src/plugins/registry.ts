import { MoPlugin } from '../types';

// Import all plugins
import { ProgressBarPlugin } from './progress-bar';
import { SlideNumberPlugin } from './slide-number';
import { ControllerPlugin } from './controller';
import { OverviewModePlugin } from './overview-mode';

// Plugin registry - automatically includes all available plugins
export const pluginRegistry: Record<string, new () => MoPlugin> = {
  ProgressBar: ProgressBarPlugin,
  SlideNumber: SlideNumberPlugin,
  Controller: ControllerPlugin,
  OverviewMode: OverviewModePlugin,
};

/**
 * Get available plugin names
 */
export function getAvailablePlugins(): string[] {
  return Object.keys(pluginRegistry);
}

/**
 * Create plugin instances from configuration
 * Only creates instances for plugins specified in the config array
 */
export function createPluginInstances(pluginNames: string[]): MoPlugin[] {
  const instances: MoPlugin[] = [];
  
  for (const pluginName of pluginNames) {
    const PluginClass = pluginRegistry[pluginName];
    
    if (PluginClass) {
      try {
        const instance = new PluginClass();
        instances.push(instance);
      } catch (error) {
        console.warn(`Failed to create plugin instance: ${pluginName}`, error);
      }
    } else {
      console.warn(`Plugin not found: ${pluginName}. Available plugins: ${getAvailablePlugins().join(', ')}`);
    }
  }
  
  return instances;
}

/**
 * Initialize plugins with the Mo instance
 */
export function initializePlugins(plugins: MoPlugin[], mo: any): void {
  plugins.forEach(plugin => {
    try {
      plugin.init(mo);
    } catch (error) {
      console.error(`Failed to initialize plugin: ${plugin.name}`, error);
    }
  });
}

/**
 * Destroy all plugins
 */
export function destroyPlugins(plugins: MoPlugin[]): void {
  plugins.forEach(plugin => {
    try {
      if (plugin.destroy) {
        plugin.destroy();
      }
    } catch (error) {
      console.error(`Failed to destroy plugin: ${plugin.name}`, error);
    }
  });
}
