import {
  TemplateChoice,
  ThemeChoice,
  PluginChoice,
  TransitionChoice,
} from "../init";

export const TEMPLATES = {
  CUSTOM: "custom",
  BASIC: "basic",
  DEMO: "demo",
} as const;

export const TEMPLATE_CHOICES: TemplateChoice[] = [
  {
    name: "Custom - Configure settings",
    value: "custom",
    short: "Custom",
  },
  {
    name: "Basic - Quick start with default settings (as a basic example)",
    value: "basic",
    short: "Basic",
  },
  {
    name: "Demo - Complete example with sample content (as an advanced example)",
    value: "demo",
    short: "Demo",
  },
];

export const THEME_CHOICES: ThemeChoice[] = [
  { name: "Dark - Modern dark theme", value: "dark" },
  { name: "Light - Clean light theme", value: "light" },
  { name: "Dracula - Purple dark theme", value: "dracula" },
  { name: "Ocean - Blue ocean theme", value: "ocean" },
  { name: "Rainbow - Colorful theme", value: "rainbow" },
];

export const PLUGIN_CHOICES: PluginChoice[] = [
  {
    name: "Progress Bar - Shows presentation progress",
    value: "ProgressBar",
    checked: true,
  },
  {
    name: "Slide Number - Shows current slide number",
    value: "SlideNumber",
    checked: true,
  },
  {
    name: "Controller - Navigation controls",
    value: "Controller",
    checked: true,
  },
  {
    name: "Confetti - Celebration effects",
    value: "Confetti",
    checked: true,
  },
];

export const TRANSITION_CHOICES: TransitionChoice[] = [
  { name: "Horizontal - Slide left/right", value: "horizontal" },
  { name: "Vertical - Slide up/down", value: "vertical" },
  { name: "Fade - Fade in/out", value: "fade" },
];

export const DEFAULT_VALUES = {
  template: "custom",
  theme: "dark",
  transition: "horizontal",
  contentPath: "./slides.md",
  configPath: "./config.json",
  urlHash: true,
  centerContent: true,
  createConfigFile: true,
  createContentFile: true,
} as const;

export const PLUGIN_CONFIGS = {
  ProgressBar: {
    enabled: true,
    position: "bottom",
    height: "12px",
  },
  SlideNumber: {
    enabled: true,
    position: "bottom-right",
    format: "current/total",
  },
  Controller: {
    enabled: true,
    position: "bottom-center",
  },
  Confetti: {
    enabled: true,
    particleCount: 50,
    size: {
      min: 5,
      max: 15,
    },
    duration: 4000,
    delay: 50,
  },
} as const;
