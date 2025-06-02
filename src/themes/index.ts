// Import CSS files as raw strings
import lightThemeCSS from './light.css?raw';
import darkThemeCSS from './dark.css?raw';
import solarizedThemeCSS from './solarized.css?raw';
import draculaThemeCSS from './dracula.css?raw';
import baseStylesCSS from '../styles/base.css?raw';

export interface Theme {
  name: string;
  cssContent: string;
}

export const availableThemes: Record<string, Theme> = {
  light: {
    name: 'light',
    cssContent: lightThemeCSS
  },
  dark: {
    name: 'dark',
    cssContent: darkThemeCSS
  },
  solarized: {
    name: 'solarized',
    cssContent: solarizedThemeCSS
  },
  dracula: {
    name: 'dracula',
    cssContent: draculaThemeCSS
  }
};

let baseStylesLoaded = false;

export async function loadTheme(themeName: string): Promise<void> {
  const theme = availableThemes[themeName];
  if (!theme) {
    console.warn(`Theme "${themeName}" not found. Using default light theme.`);
    return loadTheme('light');
  }

  // Load base styles first if not already loaded
  if (!baseStylesLoaded) {
    loadBaseStyles();
    baseStylesLoaded = true;
  }

  // Remove existing theme styles
  const existingThemeStyles = document.querySelectorAll('style[data-mo-theme]');
  existingThemeStyles.forEach(style => style.remove());

  // Add new theme styles
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-mo-theme', themeName);
  styleElement.textContent = theme.cssContent;
  document.head.appendChild(styleElement);
}

function loadBaseStyles(): void {
  // Check if base styles are already loaded
  if (document.querySelector('style[data-mo-base]')) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-mo-base', 'true');
  styleElement.textContent = baseStylesCSS;
  document.head.appendChild(styleElement);
}

export function getAvailableThemes(): string[] {
  return Object.keys(availableThemes);
}