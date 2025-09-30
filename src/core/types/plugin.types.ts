/**
 * Plugin system types for Mostage
 * Defines interfaces and types for the plugin architecture
 */

import { MoPlugin, MostageInstance } from "./core.types";

// Base plugin configuration
export interface BasePluginConfig {
  enabled?: boolean;
}

// Progress Bar Plugin
export interface ProgressBarConfig extends BasePluginConfig {
  position?: "top" | "bottom";
  height?: string;
  color?: string;
  backgroundColor?: string;
}

// Slide Number Plugin
export interface SlideNumberConfig extends BasePluginConfig {
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  format?: string;
  color?: string;
  fontSize?: string;
}

// Controller Plugin
export interface ControllerConfig extends BasePluginConfig {
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  showLabels?: boolean;
  theme?: "light" | "dark";
}

// Confetti Plugin
export interface ConfettiConfig extends BasePluginConfig {
  particleCount?: number;
  size?: {
    min: number;
    max: number;
  };
  duration?: number;
  delay?: number;
  colors?: string[];
  shapes?: string[];
}

// Plugin factory interface
export interface PluginFactory {
  create(name: string, config?: any): MoPlugin;
  getAvailablePlugins(): string[];
  registerPlugin(name: string, pluginClass: new () => MoPlugin): void;
}

// Plugin lifecycle hooks
export interface PluginLifecycle {
  onInit?(mo: MostageInstance, config?: any): void;
  onDestroy?(): void;
  onSlideChange?(currentSlide: number, totalSlides: number): void;
  onOverviewToggle?(isOverview: boolean): void;
}

// Enhanced plugin interface with lifecycle hooks
export interface EnhancedPlugin extends MoPlugin, PluginLifecycle {
  readonly version: string;
  readonly description: string;
  readonly author?: string;
  readonly dependencies?: string[];
}

// Plugin registry interface
export interface PluginRegistry {
  register(name: string, plugin: new () => MoPlugin): void;
  get(name: string): (new () => MoPlugin) | undefined;
  getAll(): Record<string, new () => MoPlugin>;
  has(name: string): boolean;
  unregister(name: string): boolean;
}

// Plugin manager interface
export interface PluginManager {
  loadPlugin(name: string, config?: any): Promise<MoPlugin>;
  unloadPlugin(name: string): void;
  getLoadedPlugins(): MoPlugin[];
  isPluginLoaded(name: string): boolean;
  enablePlugin(name: string): void;
  disablePlugin(name: string): void;
}
