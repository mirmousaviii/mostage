# Mo-Slide

A modern, plugin-based, themeable slide presentation framework written in TypeScript. Similar to reveal.js but with a focus on simplicity and extensibility.

## Features

- 🎨 **Multiple Themes** - Light, Dark, Solarized, Dracula and more
- 🔧 **Plugin System** - Extensible architecture for custom functionality  
- 📝 **Custom Markdown Parser** - Built from scratch, no external dependencies
- 🎭 **Smooth Transitions** - Horizontal, vertical, fade animations
- 📱 **Touch Support** - Swipe navigation on mobile devices
- ⌨️ **Keyboard Navigation** - Arrow keys, spacebar, ESC for overview
- 🎯 **Overview Mode** - Grid view of all slides
- 📦 **TypeScript** - Full type safety and modern development experience
- ⚡ **Vite Powered** - Fast development and optimized builds
- 📋 **CLI Tools** - Easy project creation and building

## Quick Start

### Installation

```bash
npm install mo-slide
```

### Basic Usage

```html
<div id="app"></div>
<script type="module">
  import Mo from "mo-slide";
  
  const mo = new Mo({ 
    element: "#app", 
    theme: "light", 
    markdown: "./slides.md",
    transition: "horizontal",
    plugins: ["ProgressBar", "SlideNumber", "Controller"]
  });
  
  mo.start();
</script>
```

### CLI Usage

```bash
# Create new presentation
npx mo-slide init my-presentation --with-example

# Start development server
npx mo-slide serve slides.md

# Build static HTML
npx mo-slide build slides.md --theme dark -o presentation.html

# List available themes
npx mo-slide themes
```

## Markdown Syntax

Mo-Slide supports a subset of Markdown syntax:

```markdown
# Main Title
## Subtitle

Regular paragraph with **bold** and *italic* text.

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Another item

\`inline code\` and code blocks:

\`\`\`javascript
const example = "Hello World";
\`\`\`

> Blockquote text

[Link text](https://example.com)

---
```

Use `---` to separate slides.

## Themes

Built-in themes are loaded dynamically from separate CSS files:
- `light` - Clean light theme (default)
- `dark` - Dark theme with blue accents  
- `solarized` - Solarized color scheme
- `dracula` - Popular dark theme

Themes are specified in the configuration and loaded automatically:

```typescript
const mo = new Mo({
  element: '#app',
  theme: "dracula", // Loads themes/dracula.css
  markdown: './slides.md'
});
```

### Custom Themes

You can create custom themes by:

1. Creating a new CSS file (e.g., `custom.css`)
2. Placing it in the `themes/` directory
3. Adding it to the available themes:

```typescript
import { availableThemes } from 'mo-slide';

availableThemes.custom = {
  name: 'custom',
  cssPath: './themes/custom.css'
};
```

## Plugins

### Built-in Plugins

- **ProgressBar** - Shows presentation progress at bottom
- **SlideNumber** - Displays current slide number  
- **Controller** - Previous/next navigation buttons
- **OverviewMode** - Grid overview (press ESC)

### Custom Plugins

```typescript
import { MoPlugin } from 'mo-slide';

class CustomPlugin implements MoPlugin {
  name = 'CustomPlugin';
  
  init(mo: Mo): void {
    console.log('Plugin initialized!');
    // Add your custom functionality
  }
  
  destroy?(): void {
    // Cleanup when plugin is destroyed
  }
}

const mo = new Mo({
  plugins: [
    'ProgressBar',        // Built-in plugin by name
    new CustomPlugin()    // Custom plugin instance
  ]
});
```

## API Reference

### Mo Class

```typescript
interface MoConfig {
  element?: string | HTMLElement;
  theme?: string;
  markdown?: string;
  transition?: 'horizontal' | 'vertical' | 'fade' | 'slide-in' | 'slide-out';
  plugins?: string[] | MoPlugin[];
  autoProgress?: boolean;
  keyboard?: boolean;
  touch?: boolean;
  loop?: boolean;
  speed?: number;
}

class Mo {
  constructor(config: MoConfig)
  
  async start(): Promise<void>
  nextSlide(): void
  previousSlide(): void
  goToSlide(index: number): void
  getCurrentSlide(): number
  getTotalSlides(): number
  on(event: string, callback: Function): void
  destroy(): void
}
```

### Events

```typescript
mo.on('slidechange', (event) => {
  console.log(`Slide ${event.currentSlide + 1} of ${event.totalSlides}`);
});

mo.on('ready', () => {
  console.log('Presentation is ready!');
});
```

## Development

```bash
# Clone the repository
git clone https://github.com/mojs/mo-slide.git
cd mo-slide

# Install dependencies  
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Example

Check out the simple example in the `example/` directory:

- `example/index.html` - Clean, minimal HTML showing typical usage
- `example/slides.md` - Sample presentation content  

Run `npm run dev` and visit http://localhost:5174/ to see Mo-Slide in action.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Homepage:** [mo.js.org](https://mo.js.org)
- **Repository:** [github.com/mojs/mo-slide](https://github.com/mojs/mo-slide)
- **Issues:** [github.com/mojs/mo-slide/issues](https://github.com/mojs/mo-slide/issues)
