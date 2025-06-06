# Mostage

A modern slide presentation framework. 
Create simple presentations using **Markdown** with smooth transitions and an extensible plugin system.

## Table of Contents

- [Features](#features)
- [Why **Markdown** for Presentations?](#why-markdown-for-presentations)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Basic HTML Usage](#basic-html-usage)
  - [Inline Content](#inline-content)
  - [CommonJS/Node.js Usage (Legacy Projects)](#commonjsnodejs-usage-legacy-projects)
  - [Script Tag Usage (No Bundler)](#script-tag-usage-no-bundler)
  - [AMD/RequireJS Usage](#amdrequirejs-usage)
  - [SystemJS Usage](#systemjs-usage)
- [Markdown Syntax](#markdown-syntax)
- [Configuration](#configuration)
  - [Basic Options](#basic-options)
  - [Advanced Configuration](#advanced-configuration)
- [Themes](#themes)
  - [Built-in Themes](#built-in-themes)
  - [Using Themes](#using-themes)
  - [Custom Themes](#custom-themes)
- [Plugins](#plugins)
  - [Built-in Plugins](#built-in-plugins)
  - [Creating Custom Plugins](#creating-custom-plugins)
- [Navigation](#navigation)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Touch Navigation](#touch-navigation)
  - [Programmatic Navigation](#programmatic-navigation)
- [Events](#events)
- [CLI Usage](#cli-usage)
- [API Reference](#api-reference)
  - [Mo Class Methods](#mo-class-methods)
  - [Event Types](#event-types)
- [Development](#development)
  - [Setup](#setup)
  - [Building](#building)
- [Examples](#examples)
  - [Simple Presentation](#simple-presentation)
  - [Basic Example](#basic-example)
  - [Advanced Example](#advanced-example)
- [Contributing](#contributing)
  - [Guidelines](#guidelines)
- [License](#license)
- [Links](#links)

## Features

- **Markdown-Based** - Write presentations in simple, familiar Markdown syntax
- **No External Dependencies** - Built-in Markdown parser, no heavy libraries
- **Multiple Themes** - Light, Dark, Solarized, Dracula themes with easy customization
- **Plugin System** - Extensible architecture for adding custom functionality  
- **Smooth Transitions** - Horizontal, vertical, and fade animations
- **Touch Support** - Swipe navigation optimized for mobile devices
- **Keyboard Navigation** - Arrow keys, spacebar, and overview mode shortcuts
- **Overview Mode** - Grid view of all slides for easy navigation
- **TypeScript** - Full type safety and modern development experience
- **Fast Development** - Vite-powered with hot module replacement
- **CLI Tools** - Command-line utilities for project setup and building

## Why Markdown for Presentations?

- **Simple & Familiar** - Use the same syntax you know from GitHub, documentation, and blogs
- **Version Control Friendly** - Track changes with Git, collaborate easily
- **Focus on Content** - Write content without worrying about design
- **Portable** - Your presentations are just text files
- **Fast** - No complex editors or heavy applications needed

## Installation

```bash
npm install mostage
```

## Quick Start

### Basic HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Presentation</title>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import Mo from "mostage";
        
        const mo = new Mo({ 
            element: "#app", 
            theme: "light", 
            markdown: "./slides.md",
            plugins: ["ProgressBar", "SlideNumber", "Controller"]
        });
        
        mo.start();
    </script>
</body>
</html>
```

### Inline Content

```javascript
import Mo from "mostage";

const mo = new Mo({
    element: "#app",
    theme: "dark",
    markdown: "./slides.md",
    plugins: ["ProgressBar", "SlideNumber"]
});

mo.start();
```

### CommonJS/Node.js Usage (Legacy Projects)

For older projects using CommonJS or Node.js without ES modules:

```javascript
const Mo = require("mostage");

const mo = new Mo({
    element: "#app",
    theme: "solarized",
    markdown: "./slides.md",
    plugins: ["ProgressBar", "SlideNumber", "Controller"]
});

mo.start();
```

### Script Tag Usage (No Bundler)

For projects without any build system, use the UMD build:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Script Tag Example</title>
</head>
<body>
    <div id="app"></div>
    
    <!-- Load from CDN -->
    <script src="https://unpkg.com/mostage@latest/dist/mostage.umd.js"></script>
    
    <script>
        // Mo is available globally
        const mo = new Mo({
            element: "#app",
            theme: "dracula",
            markdown: "./presentation.md",
            plugins: ["ProgressBar", "SlideNumber"]
        });
        
        mo.start();
    </script>
</body>
</html>
```

### AMD/RequireJS Usage

For projects using AMD loaders like RequireJS:

```javascript
require.config({
    paths: {
        'mostage': 'node_modules/mostage/dist/mostage.umd'
    }
});

require(['mostage'], function(Mo) {
    const mo = new Mo({
        element: "#app", 
        theme: "light",
        markdown: "./presentation.md",
        plugins: ["ProgressBar", "SlideNumber", "Controller", "OverviewMode"]
    });
    
    mo.start();
});
```

### SystemJS Usage

For projects using SystemJS:

```javascript
System.import('mostage').then(function(Mo) {
    const mo = new Mo.default({
        element: "#app",
        theme: "dark", 
        markdown: "./slides.md",
        plugins: ["ProgressBar", "Controller"]
    });
    
    mo.start();
});
```

## Markdown Syntax

Create your presentation using standard Markdown syntax. Use `---` to separate slides:

```markdown
# Slide Title

Content with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2

1. Numbered list item
2. Another numbered item

`inline code` and code blocks:

```javascript
const example = "Hello World";
console.log(example);
```

> Blockquote for emphasis

[Link text](https://example.com)

---

# Next Slide

More content here...
```

## Configuration

### Basic Options

```typescript
interface MoConfig {
    // Target element (string selector or HTMLElement)
    element?: string | HTMLElement;
    
    // Theme name (loads from themes/ directory)
    theme?: 'light' | 'dark' | 'solarized' | 'dracula';
    
    // Markdown file path (relative to current page)
    markdown?: string;
    
    // Inline markdown content (alternative to markdown file)
    content?: string;
    
    // Transition animation type
    transition?: 'horizontal' | 'vertical' | 'fade';
    
    // Plugin names or instances
    plugins?: string[] | MoPlugin[];
    
    // Navigation options
    keyboard?: boolean;    // Enable keyboard navigation (default: true)
    touch?: boolean;       // Enable touch/swipe navigation (default: true)
    loop?: boolean;        // Loop to first slide after last (default: false)
    
    // Animation speed in milliseconds
    speed?: number;        // Default: 300
}
```

### Advanced Configuration

```typescript
const mo = new Mo({
    element: "#presentation",
    theme: "dark",
    markdown: "./slides.md",
    transition: "fade",
    speed: 500,
    keyboard: true,
    touch: true,
    loop: false,
    plugins: [
        "ProgressBar",
        "SlideNumber", 
        "Controller",
        "OverviewMode",
        new CustomPlugin()
    ]
});
```

## Themes

### Built-in Themes

- **light** - Clean light theme with professional styling
- **dark** - Dark theme with blue accents and high contrast  
- **solarized** - Solarized color scheme for reduced eye strain
- **dracula** - Popular dark theme with vibrant syntax highlighting

### Using Themes

```typescript
// Load theme by name
const mo = new Mo({
    theme: "dracula",
    markdown: "./slides.md"
});

// Switch themes dynamically
await mo.setTheme("solarized");
```

### Custom Themes

Create a custom theme by adding a CSS file:

```css
/* themes/custom.css */
.mo-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.mostage-slide h1 {
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.mostage-slide h2 {
    color: #87ceeb;
}

.mostage-slide code {
    background: rgba(255,255,255,0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
}
```

## Plugins

### Built-in Plugins

**ProgressBar**: Shows presentation progress at the bottom of the screen
```typescript
plugins: ["ProgressBar"]
```

**SlideNumber**: Displays current slide number and total slides
```typescript
plugins: ["SlideNumber"]
```

**Controller**: Adds previous/next navigation buttons
```typescript
plugins: ["Controller"]
```

**OverviewMode**: Grid overview of all slides (activated with 'O' key)
```typescript
plugins: ["OverviewMode"]
```

### Creating Custom Plugins

```typescript
import { MoPlugin, Mo } from 'mostage';

class TimerPlugin implements MoPlugin {
    name = 'TimerPlugin';
    private startTime: number = 0;
    private timerElement: HTMLElement | null = null;
    
    init(mo: Mo): void {
        this.startTime = Date.now();
        this.createTimerDisplay();
        this.updateTimer();
    }
    
    private createTimerDisplay(): void {
        this.timerElement = document.createElement('div');
        this.timerElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
            z-index: 1000;
        `;
        document.body.appendChild(this.timerElement);
    }
    
    private updateTimer(): void {
        if (!this.timerElement) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.timerElement.textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        setTimeout(() => this.updateTimer(), 1000);
    }
    
    destroy?(): void {
        if (this.timerElement) {
            this.timerElement.remove();
        }
    }
}

// Use the custom plugin
const mo = new Mo({
    plugins: ["ProgressBar", new TimerPlugin()]
});
```

## Navigation

### Keyboard Shortcuts

- **Arrow Keys**: Navigate between slides
- **Space**: Next slide
- **Home**: Go to first slide
- **End**: Go to last slide
- **O**: Toggle overview mode
- **Esc**: Exit overview mode

### Touch Navigation

- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide
- **Tap**: Next slide (in presentation mode)

### Programmatic Navigation

```typescript
// Navigate programmatically
mo.nextSlide();
mo.previousSlide();
mo.goToSlide(5);

// Get current state
const currentSlide = mo.getCurrentSlide();
const totalSlides = mo.getTotalSlides();
```

## Events

Listen to presentation events:

```typescript
// Slide change event
mo.on('slidechange', (event) => {
    console.log(`Slide ${event.currentSlide + 1} of ${event.totalSlides}`);
    console.log('Slide content:', event.slide.content);
});

// Presentation ready
mo.on('ready', (event) => {
    console.log('Presentation loaded with', event.totalSlides, 'slides');
});

// Theme change
mo.on('themechange', (event) => {
    console.log('Theme changed to:', event.theme);
});
```

## CLI Usage

The mostage CLI provides tools for creating and building presentations:

```bash
# Create a new presentation project
npx mostage init my-presentation

# Create with example content
npx mostage init my-presentation --with-example

# Start development server
npx mostage serve slides.md

# Build static HTML file
npx mostage build slides.md --output presentation.html

# Build with specific theme
npx mostage build slides.md --theme dark --output dark-presentation.html

# List available themes
npx mostage themes

# Show help
npx mostage --help
```

## API Reference

### Mo Class Methods

```typescript
class Mo {
    constructor(config: MoConfig)
    
    // Lifecycle
    async start(): Promise<void>
    destroy(): void
    
    // Navigation
    nextSlide(): void
    previousSlide(): void
    goToSlide(index: number): void
    
    // State
    getCurrentSlide(): number
    getTotalSlides(): number
    getSlides(): Slide[]
    
    // Themes
    async setTheme(themeName: string): Promise<void>
    getAvailableThemes(): string[]
    
    // Events
    on(event: string, callback: Function): void
    off(event: string, callback: Function): void
    emit(event: string, data: any): void
}
```

### Event Types

```typescript
interface SlideChangeEvent {
    type: 'slidechange';
    currentSlide: number;
    totalSlides: number;
    slide: Slide;
}

interface ReadyEvent {
    type: 'ready';
    currentSlide: number;
    totalSlides: number;
}

interface ThemeChangeEvent {
    type: 'themechange';
    theme: string;
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/mirmousaviii/mostage.git
cd mostage

# Install dependencies  
npm install

# Start development server
npm run dev

# Open http://localhost:5173/ to see examples
```

### Building

```bash
# Build library files
npm run build

# Clean build artifacts
npm run clean

# Lint code
npm run lint

# Format code
npm run format
```

## Examples

### Simple Presentation

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Presentation</title>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import Mo from "mostage";
        
        const mo = new Mo({
            element: "#app",
            theme: "light",
            content: `
# Hello World

Welcome to Mostage!

---

## Features

- Easy to use
- Fast and lightweight
- TypeScript support

---

## Thank You!
            `,
            plugins: ["ProgressBar", "SlideNumber"]
        });
        
        mo.start();
    </script>
</body>
</html>
```

### Basic Example

For a quick start, check the `example/basic.html` file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mostage Basic Example</title>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import Mo from "../src/index.ts";
        
        const mo = new Mo({
            element: "#app",
            theme: "light",
            markdown: "./slides.md",
            plugins: ["ProgressBar", "SlideNumber", "Controller", "OverviewMode"]
        });
        
        mo.start();
    </script>
</body>
</html>
```

This example loads slides from `slides.md` and includes all basic plugins.

Run `npm run dev` and visit http://localhost:5173/basic.html to see this simple example.

### Advanced Example

Check the `example/index.html` file for a complete interactive demo with:
- Theme switching
- Plugin toggling  
- Multiple transition types
- Real-time controls

Run `npm run dev` and visit http://localhost:5173/ to see the full demo

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and add tests
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Keep commits focused and descriptive

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **NPM Package**: [npmjs.com/package/mostage](https://npmjs.com/package/mostage)
- **GitHub Repository**: [github.com/mirmousaviii/mostage](https://github.com/mirmousaviii/mostage)
- **Documentation**: [mostage.js.org](https://mostage.js.org)
- **Issues & Support**: [github.com/mirmousaviii/mostage/issues](https://github.com/mirmousaviii/mostage/issues)
