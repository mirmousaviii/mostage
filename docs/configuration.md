# Configuration Reference

Complete reference for all Mostage configuration options.

## Basic Configuration

### Element Selection

```javascript
// By CSS selector
element: "#app";

// By DOM element
element: document.getElementById("app");
```

### Theme Selection

```javascript
theme: "light"; // Light theme (default)
theme: "dark"; // Dark theme
theme: "dracula"; // Dracula theme
theme: "ocean"; // Ocean theme
theme: "rainbow"; // Rainbow theme
```

### Content Loading

```javascript
// Load from file
contentPath: "./slides.md";

// Inline content
content: "# My Presentation\n\n## Slide 1\n\nContent here...";
```

### Scale and Loop

```javascript
scale: 1.0; // Scale factor (0.5 to 2.0)
loop: false; // Loop after last slide
```

### Navigation

```javascript
keyboard: true; // Enable keyboard navigation
touch: true; // Enable touch navigation
urlHash: false; // Enable URL hash navigation
```

## Transition Configuration

```javascript
transition: {
  type: "horizontal",     // horizontal, vertical, fade, slide
  duration: 600,          // Duration in milliseconds
  easing: "ease-in-out"   // CSS easing function
}
```

## Content Centering

```javascript
centerContent: {
  vertical: true,    // Vertical centering
  horizontal: true   // Horizontal centering
}
```

## Header Configuration

```javascript
header: {
  content: "# My Presentation",           // Header content
  contentPath: "./header.md",            // Header content file
  position: "top-left",                  // top-left, top-center, top-right
  showOnFirstSlide: true                 // Show on first slide
}
```

## Footer Configuration

```javascript
footer: {
  content: "#### Presentation Framework", // Footer content
  contentPath: "./footer.md",            // Footer content file
  position: "bottom-left",               // bottom-left, bottom-center, bottom-right
  showOnFirstSlide: true                // Show on first slide
}
```

## Background Configuration

### Single Background

```javascript
background: {
  imagePath: "./background.jpg",
  size: "cover",           // cover, contain, auto
  position: "center",      // center, top, bottom, left, right
  repeat: "no-repeat",    // no-repeat, repeat, repeat-x, repeat-y
  bgColor: "#000000",     // Background color
  global: true            // Apply to all slides
}
```

### Multiple Backgrounds

```javascript
background: [
  {
    imagePath: "./background-left.jpg",
    size: "cover",
    position: "left",
    repeat: "no-repeat",
    bgColor: "#000000",
    allSlides: [1], // Apply to slide 1
  },
  {
    imagePath: "./background-line.svg",
    size: "contain",
    position: "bottom",
    repeat: "no-repeat",
    bgColor: "#000000",
    allSlidesExcept: [1, 23], // Apply to all except slides 1 and 23
  },
];
```

### Background Options

- `global: true` - Apply to all slides
- `allSlides: [1, 2, 3]` - Apply to specific slides
- `allSlidesExcept: [1, 23]` - Apply to all except specific slides

## Plugin Configuration

### ProgressBar Plugin

```javascript
plugins: {
  ProgressBar: {
    enabled: true,           // Enable/disable
    position: "bottom",      // top, bottom
    color: "#007acc",        // Progress bar color
    height: "12px"          // Progress bar height
  }
}
```

### SlideNumber Plugin

```javascript
plugins: {
  SlideNumber: {
    enabled: true,                    // Enable/disable
    position: "bottom-right",         // bottom-right, bottom-left, bottom-center
    format: "current/total"           // Display format
  }
}
```

### Controller Plugin

```javascript
plugins: {
  Controller: {
    enabled: true,                    // Enable/disable
    position: "bottom-center"         // bottom-right, bottom-left, bottom-center
  }
}
```

### Confetti Plugin

```javascript
plugins: {
  Confetti: {
    enabled: true,                    // Enable/disable
    particleCount: 50,                // Number of particles
    colors: [                         // Particle colors
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff"
    ],
    size: {                           // Particle size range
      min: 5,
      max: 15
    },
    duration: 4000,                   // Animation duration (ms)
    delay: 50                         // Delay between particles (ms)
  }
}
```

## Complete Example

See [config-complete.json](./config-complete.json) for a complete configuration example with all options.
