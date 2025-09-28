# Usage Examples

## Basic Examples

### Simple Presentation

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

### JSON Configuration

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

## Advanced Examples

### Custom Theme and Transitions

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

### Header and Footer

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

### Background Images

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

### All Plugins Enabled

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

## Event Handling Examples

### Basic Event Handling

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

### Custom Navigation Controls

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

## Framework Integration

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

### Angular

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

## Complete Configuration Example

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

## Plugin Development

### Plugin Interface

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
