# Mostage Documentation

Complete documentation for Mostage presentation framework.

## Table of Contents

- [CLI Usage](#cli-usage)
- [Configuration Reference](./configuration.md)
- [Complete Configuration Example](./config-complete.json)
- [API Reference](./api.md)
- [Examples](./examples.md)

## Quick Start

### Basic Usage

```javascript
import Mostage from "mostage";

// Method 1: Load configuration from JSON file
const mostage = new Mostage("./config.json");
mostage.start();

// Method 2: Inline configuration
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  plugins: {
    ProgressBar: { enabled: true },
  },
});
mostage.start();
```

## CLI Usage

Mostage provides a powerful CLI for creating, developing, and building presentations.

### Installation

```bash
# Install globally
npm install -g mostage

# Or use with npx (recommended)
npx mostage <command>
```

### Available Commands

| Command          | Description                               | Options                       |
| ---------------- | ----------------------------------------- | ----------------------------- |
| `mostage init`   | Create a new presentation project         | `--template`, `--content`     |
| `mostage dev`    | Start development server with live reload | `--port`, `--host`            |
| `mostage build`  | Build presentation for production         | `--output`, `--minify`        |
| `mostage theme`  | Manage themes (list, add, remove)         | `--list`, `--add`, `--remove` |
| `mostage plugin` | Manage plugins (list, add, remove)        | `--list`, `--add`, `--remove` |
| `mostage help`   | Show help and command information         |                               |

### Command Examples

#### Initialize a new project

```bash
# Basic project
npx mostage init

# With specific template
npx mostage init --template demo

# With custom content path
npx mostage init --content ./my-slides.md
```

#### Development

```bash
# Start dev server on default port (3000)
npx mostage dev

# Start on custom port
npx mostage dev --port 8080

# Start on specific host
npx mostage dev --host 0.0.0.0
```

#### Building for production

```bash
# Build to dist folder
npx mostage build

# Build to custom output directory
npx mostage build --output ./build

# Build with minification
npx mostage build --minify
```

#### Theme management

```bash
# List available themes
npx mostage theme --list

# Add a custom theme
npx mostage theme --add ./my-theme.css

# Remove a theme
npx mostage theme --remove my-theme
```

#### Plugin management

```bash
# List available plugins
npx mostage plugin --list

# Add a plugin
npx mostage plugin --add progress-bar

# Remove a plugin
npx mostage plugin --remove confetti
```

### Project Structure

When you run `mostage init`, it creates the following structure:

```
my-presentation/
├── index.html          # Main HTML file
├── slides.md          # Presentation content
├── config.json        # Configuration file
└── assets/            # CSS and JS files (if using local assets)
    ├── mostage.css
    └── index.js
```

### Configuration File

The `config.json` file contains all presentation settings:

```json
{
  "element": "#app",
  "theme": "dark",
  "contentPath": "./slides.md",
  "scale": 1.0,
  "transition": {
    "type": "horizontal",
    "duration": 600,
    "easing": "ease-in-out"
  },
  "plugins": {
    "ProgressBar": {
      "enabled": true,
      "position": "top"
    },
    "SlideNumber": {
      "enabled": true,
      "position": "bottom-right"
    }
  }
}
```

## Configuration Options

### Basic Settings

| Option     | Type                    | Default         | Description                                       |
| ---------- | ----------------------- | --------------- | ------------------------------------------------- |
| `element`  | `string \| HTMLElement` | `document.body` | DOM element to mount the presentation             |
| `theme`    | `string`                | `"light"`       | Theme name (light, dark, dracula, ocean, rainbow) |
| `scale`    | `number`                | `1.0`           | Slide scale factor                                |
| `loop`     | `boolean`               | `false`         | Loop after last slide                             |
| `keyboard` | `boolean`               | `true`          | Enable keyboard navigation                        |
| `touch`    | `boolean`               | `true`          | Enable touch navigation                           |
| `urlHash`  | `boolean`               | `false`         | Enable URL hash navigation                        |

### Content Configuration

| Option        | Type     | Default     | Description             |
| ------------- | -------- | ----------- | ----------------------- |
| `content`     | `string` | `undefined` | Direct content (string) |
| `contentPath` | `string` | `undefined` | Content file path       |

### Transition Configuration

| Option                | Type     | Default         | Description                                         |
| --------------------- | -------- | --------------- | --------------------------------------------------- |
| `transition.type`     | `string` | `"horizontal"`  | Transition type (horizontal, vertical, fade, slide) |
| `transition.duration` | `number` | `600`           | Transition duration (ms)                            |
| `transition.easing`   | `string` | `"ease-in-out"` | Animation easing                                    |

### Header Configuration

| Option                    | Type      | Default      | Description                                |
| ------------------------- | --------- | ------------ | ------------------------------------------ |
| `header.content`          | `string`  | `undefined`  | Header content                             |
| `header.contentPath`      | `string`  | `undefined`  | Header content file                        |
| `header.position`         | `string`  | `"top-left"` | Position (top-left, top-center, top-right) |
| `header.showOnFirstSlide` | `boolean` | `true`       | Show on first slide                        |

### Footer Configuration

| Option                    | Type      | Default         | Description                                         |
| ------------------------- | --------- | --------------- | --------------------------------------------------- |
| `footer.content`          | `string`  | `undefined`     | Footer content                                      |
| `footer.contentPath`      | `string`  | `undefined`     | Footer content file                                 |
| `footer.position`         | `string`  | `"bottom-left"` | Position (bottom-left, bottom-center, bottom-right) |
| `footer.showOnFirstSlide` | `boolean` | `true`          | Show on first slide                                 |

### Background Configuration

| Option                       | Type       | Default       | Description                            |
| ---------------------------- | ---------- | ------------- | -------------------------------------- |
| `background.imagePath`       | `string`   | `undefined`   | Background image path                  |
| `background.size`            | `string`   | `"cover"`     | Background size (cover, contain, auto) |
| `background.position`        | `string`   | `"center"`    | Background position                    |
| `background.repeat`          | `string`   | `"no-repeat"` | Background repeat                      |
| `background.bgColor`         | `string`   | `undefined`   | Background color                       |
| `background.global`          | `boolean`  | `false`       | Apply to all slides                    |
| `background.allSlides`       | `number[]` | `[]`          | Specific slide numbers                 |
| `background.allSlidesExcept` | `number[]` | `[]`          | Exclude specific slides                |

### Plugin Configuration

#### ProgressBar Plugin

| Option                         | Type      | Default     | Description            |
| ------------------------------ | --------- | ----------- | ---------------------- |
| `plugins.ProgressBar.enabled`  | `boolean` | `false`     | Enable/disable plugin  |
| `plugins.ProgressBar.position` | `string`  | `"bottom"`  | Position (top, bottom) |
| `plugins.ProgressBar.color`    | `string`  | `"#007acc"` | Progress bar color     |
| `plugins.ProgressBar.height`   | `string`  | `"12px"`    | Progress bar height    |

#### SlideNumber Plugin

| Option                         | Type      | Default           | Description                                         |
| ------------------------------ | --------- | ----------------- | --------------------------------------------------- |
| `plugins.SlideNumber.enabled`  | `boolean` | `false`           | Enable/disable plugin                               |
| `plugins.SlideNumber.position` | `string`  | `"bottom-right"`  | Position (bottom-right, bottom-left, bottom-center) |
| `plugins.SlideNumber.format`   | `string`  | `"current/total"` | Display format                                      |

#### Controller Plugin

| Option                        | Type      | Default           | Description                                         |
| ----------------------------- | --------- | ----------------- | --------------------------------------------------- |
| `plugins.Controller.enabled`  | `boolean` | `false`           | Enable/disable plugin                               |
| `plugins.Controller.position` | `string`  | `"bottom-center"` | Position (bottom-right, bottom-left, bottom-center) |

#### Confetti Plugin

| Option                           | Type       | Default                             | Description                  |
| -------------------------------- | ---------- | ----------------------------------- | ---------------------------- |
| `plugins.Confetti.enabled`       | `boolean`  | `false`                             | Enable/disable plugin        |
| `plugins.Confetti.particleCount` | `number`   | `50`                                | Number of particles          |
| `plugins.Confetti.colors`        | `string[]` | `["#ff6b6b", "#4ecdc4", "#45b7d1"]` | Particle colors              |
| `plugins.Confetti.size.min`      | `number`   | `5`                                 | Minimum particle size        |
| `plugins.Confetti.size.max`      | `number`   | `15`                                | Maximum particle size        |
| `plugins.Confetti.duration`      | `number`   | `4000`                              | Animation duration (ms)      |
| `plugins.Confetti.delay`         | `number`   | `50`                                | Delay between particles (ms) |

## Examples

See [examples.md](./examples.md) for more detailed examples.

## API Reference

See [api.md](./api.md) for complete API documentation.
