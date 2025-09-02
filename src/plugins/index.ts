// Export the plugin registry system
export { 
  pluginRegistry,
  getAvailablePlugins,
  createPluginInstances,
  initializePlugins,
  destroyPlugins
} from './registry';

// Export individual plugin classes for direct use
export { ProgressBarPlugin } from './progress-bar';
export { SlideNumberPlugin } from './slide-number';
export { ControllerPlugin } from './controller';
export { OverviewModePlugin } from './overview-mode';
