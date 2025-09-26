# Mostage

[![npm version](https://img.shields.io/npm/v/mostage.svg)](https://www.npmjs.com/package/mostage)

Presentation framework based on **Markdown** (with HTML support) to web-based slide.

## [Demo](https://mo.js.org) | [Documentation](./doc/README.md)

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
        theme: "dark",
        // contentPath: "./slides.md",
        content: `
# Slide 1: Welcome
Welcome to Mostage presentation framework!

---

# Slide 2: Features
- Markdown based
- HTML support
- Theme system
- Plugin system

---

# Slide 3: Getting Started
Start creating your presentations!
        `,
      });

      mostage.start();
    </script>
  </body>
</html>
```

### JSON Configuration

You can also load your configuration from a separate JSON file:

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

      // Load configuration from JSON file
      const mostage = new Mostage("./config.json");
      mostage.start();
    </script>
  </body>
</html>
```

## Documentation

**[Complete Documentation](./doc/README.md)** - Full documentation with all configuration options, API reference, and examples.

### Quick Links

- [Configuration Reference](./doc/configuration.md) - All configuration options
- [API Reference](./doc/api.md) - Complete API documentation
- [Examples](./doc/examples.md) - Various usage examples
- [Complete Config Example](./doc/config-complete.json) - Full configuration example

## Installation

```bash
npm install mostage
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
