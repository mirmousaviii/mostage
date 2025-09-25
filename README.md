# Mostage

A modern slide presentation framework.
Create simple presentations using **Markdown** (with HTML support) to web-based slide.

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
        contentPath: "./slides.md",
        plugins: {
          ProgressBar: { position: "top" },
          SlideNumber: { position: "bottom-right" },
          Controller: { show: true },
        },
      });

      mostage.start();
    </script>
  </body>
</html>
```

### Configuration Plugin System

Mostage features a powerful configuration-based plugin system. **Just include the plugin in your configuration and it's automatically active!**

```javascript
import Mostage from "mostage";

const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  scale: 1.0,
  transition: {
    type: "horizontal", // horizontal | vertical | fade | slide
    duration: 600, // (ms)
    easing: "ease-in-out", // easing type
  },
  loop: false,
  plugins: {
    ProgressBar: {
      position: "top", // top | bottom
      color: "#007acc", // CSS color value
      height: "5px", // CSS size value
    },
    SlideNumber: {
      position: "bottom-right", // bottom-right | bottom-left | bottom-center
      format: "current/total", // e.g., "1/10"
    },
    Controller: {
      show: true, // Show or hide the controller
      position: "bottom-center", // bottom-right | bottom-left | bottom-center
    },
  },
  // centerContent is enabled by default with both vertical and horizontal centering
  // To disable: centerContent: false
  // To customize: centerContent: { vertical: true, horizontal: false }
  // centerContent: {
  //   vertical: true, // Center vertically
  //   horizontal: true, // Center horizontally
  // },
});

mostage.start();
```

### Built-in Features

#### Overview Mode

Overview mode is always available and allows you to see all slides in a grid view:

- Press `Escape` or `o` to toggle overview mode
- Click on any slide thumbnail to jump to that slide
- Click the × button or press `Escape` to exit overview mode

#### Content Centering

Content centering is enabled by default:

- All slides are centered both vertically and horizontally
- To disable: `centerContent: false`
- To customize: `centerContent: { vertical: true, horizontal: false }`

### Internal Content

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
    SlideNumber: { position: "bottom-right" },
  },
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
  contentPath: "./slides.md",
  plugins: {
    ProgressBar: { position: "bottom" },
    SlideNumber: { position: "bottom-left" },
    Controller: { show: true },
  },
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
        contentPath: "./presentation.md",
        plugins: {
          ProgressBar: { color: "#ff6b6b" },
          SlideNumber: { format: "Slide current of total" },
        },
      });

      mostage.start();
    </script>
  </body>
</html>
```

### RequireJS Usage

For projects using AMD loaders like RequireJS:

```javascript
require.config({
  paths: {
    mostage: "node_modules/mostage/dist/mostage.umd",
  },
});

require(["mostage"], function (Mostage) {
  const mostage = new Mostage({
    element: "#app",
    theme: "light",
    contentSource: "./presentation.md",
    plugins: {
      ProgressBar: { position: "top", height: "6px" },
      SlideNumber: { position: "bottom-center" },
      Controller: { position: "bottom-right" },
      OverviewMode: { scale: 0.3 },
    },
  });

  mostage.start();
});
```

### SystemJS Usage

For projects using SystemJS:

```javascript
System.import("mostage").then(function (Mostage) {
  const mostage = new Mostage({
    element: "#app",
    theme: "dark",
    contentPath: "./slides.md",
    plugins: {
      ProgressBar: { color: "#00ff00" },
      Controller: { show: false },
    },
  });

  mostage.start();
});
```

<!--
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
-->

## Development and Contributing

Welcome contributions! Here's how to get started:

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

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and add tests
5. Commit your changes: `git commit -m 'add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **NPM Package**: [npmjs.com/package/mostage](https://npmjs.com/package/mostage)
- **GitHub Repository**: [github.com/mirmousaviii/mostage](https://github.com/mirmousaviii/mostage)
- **Documentation**: [mostage.js.org](https://mo.js.org)
- **Issues & Support**: [github.com/mirmousaviii/mostage/issues](https://github.com/mirmousaviii/mostage/issues)
