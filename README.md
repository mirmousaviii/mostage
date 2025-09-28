# Mostage

[![npm version](https://img.shields.io/npm/v/mostage.svg)](https://www.npmjs.com/package/mostage)
[![Publish Package](https://github.com/mirmousaviii/mostage/actions/workflows/publish.yml/badge.svg)](https://github.com/mirmousaviii/mostage/actions/workflows/publish.yml)

Presentation framework based on **Markdown** (with HTML support) to web-based slide.

#### [Demo](https://mo.js.org) | [Quick Start](#quick-start) | [Configuration](#configuration) | [API Reference](docs/api-reference.md) | [Usage Examples](docs/usage-examples.md) | [Development](docs/development.md)

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
npx mostage@latest init

# Start development server
npx mostage@latest dev

# Display help
npx mostage@latest help
```

#### Install globally

```bash
# Install CLI
npm install -g mostage

# Create a new project
mostage init
```

> **Note:** You can use the interactive command (just run `mostage init` and follow the prompts), or provide options directly (e.g., `mostage init --template dracula --content content.md`) to create presentations.

### CLI Commands

You can use these commands with `npx mostage@latest <command>`:

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
npm install mostage@latest
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
├── content.md (slides)
└── config.json (Optional)
```

2. **Create `index.html`:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Presentation</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/mostage@latest/dist/mostage.css"
    />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/mostage@latest/dist/index.js"></script>
    <script>
      //Use internal config or path of external config
      const presentation = new Mostage({
        element: "#app",
        contentPath: "./content.md",
        theme: "dark",
      });
      presentation.start();
    </script>
  </body>
</html>
```

3. **Create `content.md` with your content:**

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
        contentPath: "./content.md",
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
      contentPath: "./content.md",
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
  "contentPath": "./content.md",
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

## Configuration Example

For a complete configuration example, see [Usage Examples](docs/usage-examples.md#complete-configuration-example).

## Usage Examples

For detailed usage examples and advanced configurations, see [Usage Examples](docs/usage-examples.md).

## API Reference

For complete API documentation, see [API Reference](docs/api-reference.md).

## Development

For development guidelines, contribution instructions, and CI/CD pipeline information, see the [Development Guide](docs/development.md).

## License

MIT License - see [LICENSE](LICENSE) file for details.
