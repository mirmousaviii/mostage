# Examples

Various examples showing how to use Mostage.

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
  scale: 1.1,
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
    content: "#### 2024 Conference",
    position: "bottom-right",
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

### Dynamic Content Updates

```javascript
const mostage = new Mostage({
  element: "#app",
  theme: "light",
  contentPath: "./slides.md",
});

mostage.on("slidechange", (data) => {
  // Update progress bar
  const progress = ((data.currentSlide + 1) / data.totalSlides) * 100;
  document.getElementById("progress").style.width = `${progress}%`;

  // Update slide counter
  document.getElementById("counter").textContent =
    `${data.currentSlide + 1} / ${data.totalSlides}`;

  // Update slide title
  const title = data.slide.content.split("\n")[0].replace("#", "").trim();
  document.getElementById("title").textContent = title;
});

mostage.start();
```

## Plugin Examples

### Custom Progress Plugin

```javascript
class CustomProgress {
  name = "CustomProgress";

  init(mostage, config) {
    this.mostage = mostage;
    this.config = config;

    if (config.enabled) {
      this.createProgressBar();
      this.setupEventListeners();
    }
  }

  createProgressBar() {
    this.progressBar = document.createElement("div");
    this.progressBar.className = "custom-progress";
    this.progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
      transition: width 0.3s ease;
      z-index: 1000;
    `;
    document.body.appendChild(this.progressBar);
  }

  setupEventListeners() {
    this.mostage.on("slidechange", (data) => {
      const progress = ((data.currentSlide + 1) / data.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
    });
  }

  destroy() {
    if (this.progressBar) {
      this.progressBar.remove();
    }
  }
}

// Register plugin
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
  plugins: {
    CustomProgress: { enabled: true },
  },
});
```

## Integration Examples

### React Integration

```jsx
import React, { useEffect, useRef } from "react";
import Mostage from "mostage";

function Presentation() {
  const containerRef = useRef(null);
  const mostageRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      mostageRef.current = new Mostage({
        element: containerRef.current,
        theme: "dark",
        contentPath: "./slides.md",
      });

      mostageRef.current.start();
    }

    return () => {
      if (mostageRef.current) {
        mostageRef.current.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
```

### Vue Integration

```vue
<template>
  <div ref="container"></div>
</template>

<script>
import Mostage from "mostage";

export default {
  name: "Presentation",
  mounted() {
    this.mostage = new Mostage({
      element: this.$refs.container,
      theme: "dark",
      contentPath: "./slides.md",
    });

    this.mostage.start();
  },
  beforeDestroy() {
    if (this.mostage) {
      this.mostage.destroy();
    }
  },
};
</script>
```

### Angular Integration

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
