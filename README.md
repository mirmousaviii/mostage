# Mostage

[![npm version](https://img.shields.io/npm/v/mostage.svg)](https://www.npmjs.com/package/mostage)

Presentation framework based on **Markdown** (with HTML support) to web-based slide.

## [Demo](https://mo.js.org) | [Documentation](./docs/README.md) | [Configuration Example](./config-complete.json)

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

| Command          | Description              |
| ---------------- | ------------------------ |
| `mostage init`   | Create a new project     |
| `mostage dev`    | Start development server |
| `mostage build`  | Build for production     |
| `mostage theme`  | Manage themes            |
| `mostage plugin` | Manage plugins           |
| `mostage help`   | Show help                |

For detailed CLI documentation, see [CLI Reference](./docs/README.md#cli-usage).

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

## Framework Integration

Mostage works with popular frameworks and build tools:

### React

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
      "particleCount": 50,
      "colors": ["#ff6b6b", "#4ecdc4", "#45b7d1"]
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

## Documentation

- **[Complete Documentation](./docs/README.md)** - Full documentation
- **[Configuration Reference](./docs/configuration.md)** - All configuration options
- **[API Reference](./docs/api.md)** - Complete API documentation
- **[Examples](./docs/examples.md)** - Various usage examples

## License

MIT License - see [LICENSE](LICENSE) file for details.
