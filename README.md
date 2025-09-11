# Mostage

A modern slide presentation framework. 
Create simple presentations using **Markdown** with smooth transitions and an extensible plugin system.

## Table of Contents

- [Features](#features)
- [Why **Markdown** for Presentations?](#why-markdown-for-presentations)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Basic HTML Usage](#basic-html-usage)
  - [Configuration-based Plugin System](#configuration-based-plugin-system)
  - [Inline Content](#inline-content)
  - [CommonJS/Node.js Usage](#commonjsnodejs-usage-legacy-projects)
  - [Script Tag Usage (No Bundler)](#script-tag-usage-no-bundler)
  - [AMD/RequireJS Usage](#amdrequirejs-usage)
  - [SystemJS Usage](#systemjs-usage)
- [Markdown Syntax](#markdown-syntax)
- [Configuration](#configuration)
  - [Basic Options](#basic-options)
  - [Advanced Configuration](#advanced-configuration)
  - [Plugin Configuration](#plugin-configuration)
  - [Transition Configuration](#transition-configuration)
- [Themes](#themes)
  - [Built-in Themes](#built-in-themes)
  - [Using Themes](#using-themes)
  - [Custom Themes](#custom-themes)
- [Plugins](#plugins)
  - [Built-in Plugins](#built-in-plugins)
  - [Plugin Configuration Options](#plugin-configuration-options)
  - [Creating Custom Plugins](#creating-custom-plugins)
- [Navigation](#navigation)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Touch Navigation](#touch-navigation)
  - [Programmatic Navigation](#programmatic-navigation)
- [Events](#events)
- [CLI Usage](#cli-usage)
- [API Reference](#api-reference)
  - [Mostage Class Methods](#mostage-class-methods)
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
- **Configuration-based Plugin System** - Fine-grained control over plugin behavior
- **No External Dependencies** - Built-in Markdown parser, no heavy libraries
- **Multiple Themes** - Light, Dark, Solarized, Dracula themes with easy customization
- **Advanced Transitions** - Horizontal, vertical, fade, and slide animations with custom timing
- **Plugin System** - Extensible architecture for adding custom functionality  
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
        import Mostage from "mostage";
        
        const mostage = new Mostage({ 
            element: "#app", 
            theme: "light", 
            markdown: "./slides.md",
            plugins: {
                ProgressBar: { position: "top" },
                SlideNumber: { position: "bottom-right" },
                Controller: { show: true }
            }
        });
        
        mostage.start();
    </script>
</body>
</html>
```

### Configuration-based Plugin System

Mostage features a powerful configuration-based plugin system. **Just include the plugin in your configuration and it's automatically active!**

```javascript
import Mostage from "mostage";

const mostage = new Mostage({
    element: "#app",
    theme: "dark",
    markdown: "./slides.md",
    scale: 1.0,
    transition: {
        type: "horizontal",     // horizontal | vertical | fade | slide
        duration: 600,          // (ms)
        easing: "ease-in-out"   // easing type
    },
    loop: false,
    plugins: {
        ProgressBar: {
            position: "top",      // top | bottom
            color: "#007acc",     // CSS color value
            height: "5px"         // CSS size value
        },
        SlideNumber: {
            position: "bottom-right", // bottom-right | bottom-left | bottom-center
            format: "current/total"   // e.g., "1/10"
        },
        Controller: {
            show: true,                     // Show or hide the controller
            position: "bottom-center"       // bottom-right | bottom-left | bottom-center
        },
        OverviewMode: {
            scale: 0.2                  // Scale of slides in overview mode
        },
        CenterContent: {
            vertical: true,        // Center vertically
            horizontal: true       // Center horizontally
        }       
    }
});

mostage.start();
```

### Inline Content

```javascript
import Mostage from "mostage";

const mostage = new Mostage({
    element: "#app",
    theme: "dark",
    content: `# My Presentation

Welcome to Mostage!

---

## Features

- Easy to use
- Fast and lightweight
- TypeScript support

---

## Thank You!`,
    plugins: {
        ProgressBar: { position: "top" },
        SlideNumber: { position: "bottom-right" }
    }
});

mostage.start();
```

### CommonJS/Node.js Usage

For projects using CommonJS or Node.js without ES modules:

```javascript
const Mostage = require("mostage");

const mostage = new Mostage({
    element: "#app",
    theme: "solarized",
    markdown: "./slides.md",
    plugins: {
        ProgressBar: { position: "bottom" },
        SlideNumber: { position: "bottom-left" },
        Controller: { show: true }
    }
});

mostage.start();
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
        // Mostage is available globally
        const mostage = new Mostage({
            element: "#app",
            theme: "dracula",
            markdown: "./presentation.md",
            plugins: {
                ProgressBar: { color: "#ff6b6b" },
                SlideNumber: { format: "Slide current of total" }
            }
        });
        
        mostage.start();
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

require(['mostage'], function(Mostage) {
    const mostage = new Mostage({
        element: "#app", 
        theme: "light",
        markdown: "./presentation.md",
        plugins: {
            ProgressBar: { position: "top", height: "6px" },
            SlideNumber: { position: "bottom-center" },
            Controller: { position: "bottom-right" },
            OverviewMode: { scale: 0.3 }
        }
    });
    
    mostage.start();
});
```

### SystemJS Usage

For projects using SystemJS:

```javascript
System.import('mostage').then(function(Mostage) {
    const mostage = new Mostage({
        element: "#app",
        theme: "dark", 
        markdown: "./slides.md",
        plugins: {
            ProgressBar: { color: "#00ff00" },
            Controller: { show: false }
        }
    });
    
    mostage.start();
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
    theme?: 'light' | 'dark' | 'solarized' | 'dracula' | 'ocean';
    
    // Markdown file path (relative to current page)
    markdown?: string;
    
    // Inline markdown content (alternative to markdown file)
    content?: string;
    
    // Global scale factor for the presentation
    scale?: number;         // Default: 1.0
    
    // Transition configuration
    transition?: TransitionConfig;
    
    // Plugin configuration
    plugins?: PluginsConfig;
    
    // Navigation options
    keyboard?: boolean;    // Enable keyboard navigation (default: true)
    touch?: boolean;       // Enable touch/swipe navigation (default: true)
    loop?: boolean;        // Loop to first slide after last (default: false)
    
    speed?: number;        // Default: 300 (use transition.duration instead)
}
```

### Advanced Configuration

```typescript
const mostage = new Mostage({
    element: "#presentation",
    theme: "dark",
    markdown: "./slides.md",
    scale: 1.1,
    transition: {
        type: "fade",
        duration: 800,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    keyboard: true,
    touch: true,
    loop: false,
    plugins: {
        ProgressBar: {
            position: "top",
            color: "#ff6b6b",
            height: "6px"
        },
        SlideNumber: {
            position: "bottom-right",
            format: "Slide current of total"
        },
        Controller: {
            show: true,
            position: "bottom-center"
        },
        OverviewMode: {
            scale: 0.25
        },
        CenterContent: {
            vertical: true,
            horizontal: false
        }
    }
});
```

### Plugin Configuration

```typescript
interface PluginsConfig {
    ProgressBar?: {
        position?: 'top' | 'bottom';
        color?: string;
        height?: string;
    };
    SlideNumber?: {
        position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
        format?: string;
    };
    Controller?: {
        show?: boolean;
        position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
    };
    OverviewMode?: {
        scale?: number;
    };
    CenterContent?: {
        vertical?: boolean;
        horizontal?: boolean;
    };
}
```

### Transition Configuration

```typescript
interface TransitionConfig {
    type?: 'horizontal' | 'vertical' | 'fade' | 'slide';
    duration?: number;     // milliseconds
    easing?: string;       // CSS easing function
}
```

**Available easing functions:**
- `"ease-in-out"` - Smooth acceleration and deceleration
- `"ease-in"` - Slow start, fast finish
- `"ease-out"` - Fast start, slow finish
- `"linear"` - Constant speed
- `"cubic-bezier(0.4, 0, 0.2, 1)"` - Custom cubic-bezier curve

## Themes

### Built-in Themes

- **light** - Clean light theme with professional styling
- **dark** - Dark theme with blue accents and high contrast  
- **solarized** - Solarized color scheme for reduced eye strain
- **dracula** - Popular dark theme with vibrant syntax highlighting
- **ocean** - Calm, elegant theme inspired by the sea

### Using Themes

```typescript
// Load theme by name
const mostage = new Mostage({
    theme: "dracula",
    markdown: "./slides.md"
});

// Switch themes dynamically
await mostage.setTheme("solarized");
```

### Custom Themes

Create a custom theme by adding a CSS file:

```css
/* themes/custom.css */
.mostage-container {
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

**ProgressBar**: Shows presentation progress
```typescript
plugins: {
    ProgressBar: {
        position: "top",      // or "bottom"
        color: "#007acc",     // any CSS color
        height: "4px"         // any CSS size
    }
}
```

**SlideNumber**: Displays current slide number and total slides
```typescript
plugins: {
    SlideNumber: {
        position: "bottom-right", // or "bottom-left", "bottom-center"
        format: "current/total"   // custom format with "current" and "total" placeholders
    }
}
```

**Controller**: Adds previous/next navigation buttons
```typescript
plugins: {
    Controller: {
        show: true,                     // show or hide buttons
        position: "bottom-center"       // or "bottom-right", "bottom-left"
    }
}
```

**OverviewMode**: Grid overview of all slides (activated with 'O' key)
```typescript
plugins: {
    OverviewMode: {
        scale: 0.2                  // scale factor for thumbnails (0.1 to 1.0)
    }
}
```

**CenterContent**: Centers slide content



**Confetti**: Shows colorful confetti animation controlled directly in markdown
```typescript
plugins: {
    Confetti: true  // Enable confetti plugin
}
```

**Usage in Markdown:**
```markdown
---
<!-- confetti -->
# 🎉 Celebration Slide!
---
```
```typescript
plugins: {
    Confetti: {
        colors: ["#ff6b6b", "#4ecdc4", ...],  // array of colors for confetti particles
        duration: 3000,                       // animation duration in milliseconds
        particleCount: 50                     // number of confetti particles
    }
}
```

**Usage in Markdown:**
```markdown
---
<!-- confetti: true -->
# 🎉 Celebration Slide!
---
```
```typescript
plugins: {
    Confetti: {
        slides: [2, 5, 8],                    // slide numbers (0-indexed) where confetti appears
        colors: ["#ff6b6b", "#4ecdc4", ...],  // array of colors for confetti particles
        duration: 3000,                       // animation duration in milliseconds
        particleCount: 50                     // number of confetti particles
    }
}
```
```typescript
plugins: {
    CenterContent: {
        vertical: true,        // center vertically
        horizontal: true       // center horizontally
    }
}
```

### Plugin Configuration Options

Each plugin can be configured with specific options:

#### ProgressBar Options
- `position: "top" | "bottom"` - Position of the progress bar
- `color: string` - CSS color value (e.g., "#007acc", "red")
- `height: string` - CSS size value (e.g., "4px", "0.5rem")

#### SlideNumber Options
- `position: "bottom-right" | "bottom-left" | "bottom-center"` - Position
- `format: string` - Format string (use "current" and "total" placeholders)

#### Controller Options
- `show: boolean` - Show or hide the controller
- `position: "bottom-right" | "bottom-left" | "bottom-center"` - Position

#### OverviewMode Options
- `scale: number` - Scale factor for slides in overview mode (0.1 to 1.0)

#### CenterContent Options



#### Confetti Options
- `Confetti: boolean` - Enable or disable the confetti plugin

**Markdown Control:**
Add `<!-- confetti -->` comment to any slide to enable confetti for that slide.
- `colors: string[]` - Array of CSS color values for confetti particles
- `duration: number` - Animation duration in milliseconds (default: 3000)
- `particleCount: number` - Number of confetti particles to create (default: 50)

**Markdown Control:**
Add one of these comments to any slide to enable confetti:
- `<!-- confetti: true -->`
- `<!-- confetti -->`
- `<!-- confetti:on -->`
- `slides: number[]` - Array of slide numbers (0-indexed) where confetti should appear
- `colors: string[]` - Array of CSS color values for confetti particles
- `duration: number` - Animation duration in milliseconds (default: 3000)
- `particleCount: number` - Number of confetti particles to create (default: 50)
- `vertical: boolean` - Center content vertically
- `horizontal: boolean` - Center content horizontally

### Creating Custom Plugins

```typescript
import { MoPlugin, Mostage } from 'mostage';

class TimerPlugin implements MoPlugin {
    name = 'TimerPlugin';
    private startTime: number = 0;
    private timerElement: HTMLElement | null = null;
    
    init(mostage: Mostage, config?: any): void {
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
const mostage = new Mostage({
    plugins: {
        ProgressBar: { position: "top" },
        TimerPlugin: {}  // Custom plugin
    }
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
mostage.nextSlide();
mostage.previousSlide();
mostage.goToSlide(5);

// Get current state
const currentSlide = mostage.getCurrentSlide();
const totalSlides = mostage.getTotalSlides();
```

## Events

Listen to presentation events:

```typescript
// Slide change event
mostage.on('slidechange', (event) => {
    console.log(`Slide ${event.currentSlide + 1} of ${event.totalSlides}`);
    console.log('Slide content:', event.slide.content);
});

// Presentation ready
mostage.on('ready', (event) => {
    console.log('Presentation loaded with', event.totalSlides, 'slides');
});

// Theme change
mostage.on('themechange', (event) => {
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

### Mostage Class Methods

```typescript
class Mostage {
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
    getSlides(): MoSlide[]
    
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
    slide: MoSlide;
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
        import Mostage from "mostage";
        
        const mostage = new Mostage({
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
            plugins: {
                ProgressBar: { position: "top" },
                SlideNumber: { position: "bottom-right" }
            }
        });
        
        mostage.start();
    </script>
</body>
</html>
```

### Basic Example

For a quick start, check the `example/index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mostage Basic Example</title>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import Mostage from "../src/index.ts";
        
        const mostage = new Mostage({
            element: "#app",
            theme: "light",
            markdown: "./slides.md",
            plugins: {
                ProgressBar: { position: "top", color: "#007acc" },
                SlideNumber: { position: "bottom-right" },
                Controller: { show: true, position: "bottom-center" },
                OverviewMode: { scale: 0.2 }
            }
        });
        
        mostage.start();
    </script>
</body>
</html>
```

This example loads slides from `slides.md` and includes all basic plugins with custom configuration.

Run `npm run dev` and visit http://localhost:5173/ to see this example.

### Advanced Example

Check the `example/index.html` file for a complete interactive demo with:
- Theme switching
- Plugin toggling  
- Multiple transition types
- Real-time controls
- Configuration-based plugin system

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
