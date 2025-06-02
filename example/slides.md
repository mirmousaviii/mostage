# Welcome to Mo-Slide

A modern TypeScript presentation framework

---

## Features

- **4 Beautiful Themes** - Light, Dark, Solarized, Dracula
- **Plugin System** - Extensible and customizable
- **Responsive Design** - Works on all devices
- **High Performance** - Fast and lightweight
- **TypeScript Support** - Full type safety

---

## Getting Started

Install Mo-Slide via npm:

```bash
npm install mo-slide
```

Basic usage:

```javascript
import Mo from 'mo-slide';

const mo = new Mo({
  element: '#app',
  theme: 'light',
  markdown: './slides.md'
});

mo.start();
```

---

## Themes

### Light Theme
Perfect for professional presentations and bright environments.

### Dark Theme  
Ideal for code presentations and low-light conditions.

### Solarized Theme
Carefully crafted colors with scientific precision.

### Dracula Theme
Popular dark theme with vibrant accents.

---

## Plugin System

Built-in plugins:

- **ProgressBar** - Shows presentation progress
- **SlideNumber** - Displays current slide number
- **Controller** - Navigation controls
- **OverviewMode** - Grid view of all slides

Custom plugins:

```javascript
class CustomPlugin {
  name = 'CustomPlugin';
  
  init(mo) {
    console.log('Plugin initialized!');
  }
}
```

---

## Navigation

### Keyboard Controls
- **Arrow Keys** - Navigate slides
- **Space** - Next slide
- **Esc** - Exit overview mode
- **O** - Toggle overview mode

### Touch Controls
- **Swipe** - Navigate on mobile
- **Tap** - Next slide
- **Pinch** - Zoom content

---

## Code Syntax

Mo-Slide supports syntax highlighting:

```typescript
interface SlideConfig {
  theme: 'light' | 'dark' | 'solarized' | 'dracula';
  plugins: string[];
  element: string;
}

class Mo {
  constructor(config: SlideConfig) {
    this.config = config;
  }
  
  async start(): Promise<void> {
    // Initialize presentation
  }
}
```

---

## Responsive Design

Mo-Slide automatically adapts to:

- **Mobile devices** (< 768px)
- **Tablets** (768px - 1024px)
- **Desktops** (> 1024px)
- **Large screens** (> 1440px)

Content scales appropriately for optimal readability.

---

## Performance

Optimized for speed:

- **Fast loading** - Minimal bundle size
- **Smooth animations** - Hardware accelerated
- **Tree shaking** - Only load what you need
- **Efficient rendering** - Minimal DOM updates

---

## Thank You!

**Get started today:**
- [Documentation](https://github.com)
- [GitHub Repository](https://github.com)
- [NPM Package](https://npmjs.com)

**Happy presenting with Mo-Slide!**
