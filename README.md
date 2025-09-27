# Mostage

[![npm version](https://img.shields.io/npm/v/mostage.svg)](https://www.npmjs.com/package/mostage)

Presentation framework based on **Markdown** (with HTML support) to web-based slide.

### [Demo](https://mo.js.org) | [Quick Start](#quick-start) | [Configuration](#configuration) | [API Reference](#api-reference) | [Usage Examples](#usage-example)

## Key Features

- **📝 Markdown based** - Write slides in Markdown with HTML support
- **🎨 Multiple Themes** - Built-in themes: light, dark, dracula, ocean, rainbow
- **🔌 Plugin System** - Extensible with plugins (progress bar, slide numbers, confetti, etc.)
- **🎭 Custom Backgrounds** - Support for images, colors, and animations
- **🎪 Interactive Elements** - Support for interactive content and animations

## Quick Start

### Option 1: Using CLI

#### Using npx (no installation required)

```bash
# Create a new project
npx mostage init

# Start development server
npx mostage dev
```

#### Install globally

```bash
# Install CLI
npm install -g mostage

# Create a new project
mostage init

# Start development server
mostage dev
```

### CLI Commands

You can use these commands with `npx mostage <command>`:

| Command          | Description                               | Options                       |
| ---------------- | ----------------------------------------- | ----------------------------- |
| `mostage init`   | Create a new presentation project         | `--template`, `--content`     |
| `mostage dev`    | Start development server with live reload | `--port`, `--host`            |
| `mostage build`  | Build presentation for production         | `--output`, `--minify`        |
| `mostage theme`  | Manage themes (list, add, remove)         | `--list`, `--add`, `--remove` |
| `mostage plugin` | Manage plugins (list, add, remove)        | `--list`, `--add`, `--remove` |
| `mostage help`   | Show help and command information         |                               |

For detailed CLI documentation, see the CLI Commands section above.

### Option 2: NPM Package Installation

Install Mostage as a dependency in your project:

```bash
npm install mostage
```

Then import and use it in your project:

```javascript
import Mostage from "mostage";

//Use internal config or path of external config
const presentation = new Mostage("./config.json");

presentation.start();
```

Or with CommonJS:

```javascript
const Mostage = require("mostage");

const presentation = new Mostage("./config.json");

presentation.start();
```

### Option 3: Manual Setup

If you prefer not to use the CLI or npm package, you can set up Mostage manually:

1. **Create your project structure:**

```
my-presentation/
├── index.html (With an internal configuration or an external configuration link)
├── slides.md (Content)
└── config.json (Optional)
```

2. **Create `index.html`:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Presentation</title>
    <link rel="stylesheet" href="https://unpkg.com/mostage/dist/mostage.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/mostage/dist/index.js"></script>
    <script>
      //Use internal config or path of external config
      const presentation = new Mostage({
        element: "#app",
        contentPath: "./slides.md",
        theme: "dark",
      });
      presentation.start();
    </script>
  </body>
</html>
```

3. **Create `slides.md` with your content:**

```markdown
# Slide 1

Welcome to my presentation!

---

# Slide 2

This is the second slide.
```

4. **Create `config.json` (optional):**

```json
{
  "theme": "light",
  "scale": 1.2
}
```

### Option 4: Framework Integration

Mostage works with popular frameworks and build tools:

#### React

```jsx
import React, { useEffect, useRef } from "react";
import Mostage from "mostage";

function Presentation() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const presentation = new Mostage({
        element: containerRef.current,
        contentPath: "./slides.md",
        theme: "dark",
      });
      presentation.start();
    }
  }, []);

  return <div ref={containerRef} />;
}
```

#### Angular

```typescript
import { Component, ElementRef, OnInit, OnDestroy } from "@angular/core";
import Mostage from "mostage";

@Component({
  selector: "app-presentation",
  template: "<div></div>",
})
export class PresentationComponent implements OnInit, OnDestroy {
  private mostage: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.mostage = new Mostage({
      element: this.elementRef.nativeElement,
      theme: "dark",
      contentPath: "./slides.md",
    });
    this.mostage.start();
  }

  ngOnDestroy() {
    if (this.mostage) {
      this.mostage.destroy();
    }
  }
}
```

## Configuration

Mostage is highly configurable through the `config.json` file. Here are the main configuration options:

### Basic Configuration

```json
{
  "theme": "dark",
  "scale": 1.2,
  "urlHash": true
}
```

### Content Configuration

```json
{
  "contentPath": "./slides.md",
  "centerContent": {
    "vertical": true,
    "horizontal": true
  }
}
```

### Headers & Footers

```json
{
  "header": {
    "content": "# My Presentation",
    "position": "top-left",
    "showOnFirstSlide": false
  },
  "footer": {
    "content": "#### Presentation Framework",
    "position": "bottom-left",
    "showOnFirstSlide": true
  }
}
```

### Backgrounds

```json
{
  "background": [
    {
      "imagePath": "./background.jpg",
      "size": "cover",
      "position": "center",
      "bgColor": "#000000",
      "global": true
    }
  ]
}
```

### Plugins

```json
{
  "plugins": {
    "ProgressBar": {
      "enabled": true,
      "position": "top",
      "color": "#007acc"
    },
    "SlideNumber": {
      "enabled": true,
      "position": "bottom-right",
      "format": "current/total"
    },
    "Controller": {
      "enabled": true,
      "position": "bottom-center"
    },
    "Confetti": {
      "enabled": true,
      "particleCount": 50
    }
  }
}
```

### Available Themes

- `light` - Clean light theme
- `dark` - Modern dark theme
- `dracula` - Dracula color scheme
- `ocean` - Ocean blue theme
- `rainbow` - Colorful rainbow theme

### Built-in Plugins

- **ProgressBar** - Shows presentation progress
- **SlideNumber** - Displays current slide number
- **Controller** - Navigation controls
- **Confetti** - Celebration animations

### Complete Configuration Example

Here's a complete configuration example with all available options:

```json
{
  "element": "#app",
  "theme": "dark",
  "contentPath": "./slides.md",
  "content": "# Alternative inline content",
  "scale": 1.2,
  "transition": {
    "type": "horizontal",
    "duration": 600,
    "easing": "ease-in-out"
  },
  "loop": true,
  "keyboard": true,
  "touch": true,
  "urlHash": true,
  "centerContent": {
    "vertical": true,
    "horizontal": true
  },
  "header": {
    "content": "# Mostage Presentation",
    "contentPath": "./header.md",
    "position": "top-left",
    "showOnFirstSlide": false
  },
  "footer": {
    "content": "#### Presentation Framework",
    "contentPath": "./footer.md",
    "position": "bottom-left",
    "showOnFirstSlide": true
  },
  "background": [
    {
      "imagePath": "./background/background-left.jpg",
      "size": "cover",
      "position": "left",
      "repeat": "no-repeat",
      "bgColor": "#000000",
      "global": false,
      "allSlides": [1],
      "allSlidesExcept": []
    },
    {
      "imagePath": "./background/background-line.svg",
      "size": "contain",
      "position": "bottom",
      "repeat": "no-repeat",
      "bgColor": "#000000",
      "global": false,
      "allSlides": [],
      "allSlidesExcept": [1, 23]
    },
    {
      "imagePath": "./background/background-animation.svg",
      "size": "cover",
      "position": "center",
      "repeat": "no-repeat",
      "bgColor": "#000000",
      "global": false,
      "allSlides": [23],
      "allSlidesExcept": []
    }
  ],
  "plugins": {
    "ProgressBar": {
      "enabled": true,
      "position": "top",
      "color": "#007acc",
      "height": "12px"
    },
    "SlideNumber": {
      "enabled": true,
      "position": "bottom-right",
      "format": "current/total"
    },
    "Controller": {
      "enabled": true,
      "position": "bottom-center"
    },
    "Confetti": {
      "enabled": true,
      "particleCount": 50,
      "colors": [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff"
      ],
      "size": {
        "min": 5,
        "max": 15
      },
      "duration": 4000,
      "delay": 50
    }
  }
}
```

## API Reference

### Constructor

#### `new Mostage(config)`

Creates a new Mostage instance.

**Parameters:**

- `config` (string | object): Configuration object or path to JSON config file

**Examples:**

```javascript
// JSON file configuration
const mostage = new Mostage("./config.json");

// Inline configuration
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
});
```

### Methods

#### `start()`

Initializes and starts the presentation.

**Returns:** `Promise<void>`

**Example:**

```javascript
const mostage = new Mostage("./config.json");
await mostage.start();
```

#### `nextSlide()`

Goes to the next slide.

**Example:**

```javascript
mostage.nextSlide();
```

#### `previousSlide()`

Goes to the previous slide.

**Example:**

```javascript
mostage.previousSlide();
```

#### `goToSlide(index)`

Goes to a specific slide.

**Parameters:**

- `index` (number): Slide index (0-based)

**Example:**

```javascript
mostage.goToSlide(5); // Go to slide 6
```

#### `toggleOverview()`

Toggles overview mode.

**Example:**

```javascript
mostage.toggleOverview();
```

#### `destroy()`

Destroys the presentation and cleans up resources.

**Example:**

```javascript
mostage.destroy();
```

### Getters

#### `getCurrentSlide()`

Gets the current slide index.

**Returns:** `number`

**Example:**

```javascript
const currentSlide = mostage.getCurrentSlide();
console.log(`Current slide: ${currentSlide + 1}`);
```

#### `getTotalSlides()`

Gets the total number of slides.

**Returns:** `number`

**Example:**

```javascript
const totalSlides = mostage.getTotalSlides();
console.log(`Total slides: ${totalSlides}`);
```

#### `getSlides()`

Gets all slides data.

**Returns:** `MoSlide[]`

**Example:**

```javascript
const slides = mostage.getSlides();
console.log(`First slide content: ${slides[0].content}`);
```

#### `getContainer()`

Gets the container element.

**Returns:** `HTMLElement`

**Example:**

```javascript
const container = mostage.getContainer();
container.style.border = "1px solid red";
```

### Events

#### `on(event, callback)`

Registers an event listener.

**Parameters:**

- `event` (string): Event name
- `callback` (function): Event callback function

**Available Events:**

- `ready`: Fired when presentation is ready
- `slidechange`: Fired when slide changes

**Example:**

```javascript
mostage.on("ready", (data) => {
  console.log("Presentation ready!");
  console.log(`Total slides: ${data.totalSlides}`);
});

mostage.on("slidechange", (data) => {
  console.log(`Slide changed to: ${data.currentSlide + 1}`);
  console.log(`Current slide: ${data.slide.title}`);
});
```

### Keyboard Shortcuts

| Key            | Action             |
| -------------- | ------------------ |
| `→` or `Space` | Next slide         |
| `←`            | Previous slide     |
| `Home`         | First slide        |
| `End`          | Last slide         |
| `O`            | Toggle overview    |
| `H` or `?`     | Toggle help        |
| `Esc`          | Exit overview/help |

### Touch Gestures

| Gesture     | Action          |
| ----------- | --------------- |
| Swipe left  | Next slide      |
| Swipe right | Previous slide  |
| Pinch       | Toggle overview |

### URL Hash Navigation

When `urlHash: true` is enabled:

- `#1` - Go to slide 1
- `#5` - Go to slide 5
- URL updates automatically when navigating

## Usage Example

### Basic Examples

#### Simple Presentation

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
        contentPath: "./slides.md",
      });

      mostage.start();
    </script>
  </body>
</html>
```

#### JSON Configuration

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

      const mostage = new Mostage("./config.json");
      mostage.start();
    </script>
  </body>
</html>
```

### Advanced Examples

#### Custom Theme and Transitions

```javascript
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  scale: 0.8,
  transition: {
    type: "fade",
    duration: 800,
    easing: "ease-in-out",
  },
  loop: true,
});
```

#### Header and Footer

```javascript
const mostage = new Mostage({
  element: "#app",
  theme: "light",
  contentPath: "./slides.md",
  header: {
    content: "# My Company",
    position: "top-left",
    showOnFirstSlide: false,
  },
  footer: {
    content: "#### 2025 Conference",
    position: "bottom-left",
    showOnFirstSlide: true,
  },
});
```

#### Background Images

```javascript
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  background: [
    {
      imagePath: "./background/hero.jpg",
      size: "cover",
      position: "center",
      repeat: "no-repeat",
      bgColor: "#000000",
      allSlides: [1], // Only first slide
    },
    {
      imagePath: "./background/pattern.svg",
      size: "contain",
      position: "bottom",
      repeat: "no-repeat",
      bgColor: "#f0f0f0",
      allSlidesExcept: [1], // All except first slide
    },
  ],
});
```

#### All Plugins Enabled

```javascript
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  plugins: {
    ProgressBar: {
      enabled: true,
      position: "top",
      color: "#ff6b6b",
      height: "8px",
    },
    SlideNumber: {
      enabled: true,
      position: "bottom-right",
      format: "Slide {current} of {total}",
    },
    Controller: {
      enabled: true,
      position: "bottom-center",
    },
    Confetti: {
      enabled: true,
      particleCount: 100,
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
      size: { min: 3, max: 12 },
      duration: 3000,
      delay: 30,
    },
  },
});
```

### Event Handling Examples

#### Basic Event Handling

```javascript
const mostage = new Mostage("./config.json");

// Listen for ready event
mostage.on("ready", (data) => {
  console.log(`Presentation ready with ${data.totalSlides} slides`);
});

// Listen for slide changes
mostage.on("slidechange", (data) => {
  console.log(`Now on slide ${data.currentSlide + 1}`);

  // Update external elements
  document.getElementById("slide-title").textContent = data.slide.title;
});

mostage.start();
```

#### Custom Navigation Controls

```html
<div id="app"></div>
<div id="controls">
  <button id="prev">Previous</button>
  <button id="next">Next</button>
  <button id="overview">Overview</button>
</div>

<script type="module">
  import Mostage from "mostage";

  const mostage = new Mostage("./config.json");

  // Custom controls
  document.getElementById("prev").addEventListener("click", () => {
    mostage.previousSlide();
  });

  document.getElementById("next").addEventListener("click", () => {
    mostage.nextSlide();
  });

  document.getElementById("overview").addEventListener("click", () => {
    mostage.toggleOverview();
  });

  mostage.start();
</script>
```

### Plugin Development

#### Plugin Interface

```javascript
class MyPlugin {
  name = "MyPlugin";

  init(mostage, config) {
    // Initialize plugin
  }

  destroy() {
    // Cleanup plugin
  }

  setEnabled(enabled) {
    // Enable/disable plugin
  }
}
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
