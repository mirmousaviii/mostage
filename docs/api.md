# API Reference

Complete API documentation for Mostage.

## Constructor

### `new Mostage(config)`

Creates a new Mostage instance.

**Parameters:**

- `config` (string | object): Configuration object or path to JSON config file

**Examples:**

```javascript
// JSON file configuration
const mostage = new Mostage("./config.json");

// Inline configuration
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./slides.md",
});
```

## Methods

### `start()`

Initializes and starts the presentation.

**Returns:** `Promise<void>`

**Example:**

```javascript
const mostage = new Mostage("./config.json");
await mostage.start();
```

### `nextSlide()`

Goes to the next slide.

**Example:**

```javascript
mostage.nextSlide();
```

### `previousSlide()`

Goes to the previous slide.

**Example:**

```javascript
mostage.previousSlide();
```

### `goToSlide(index)`

Goes to a specific slide.

**Parameters:**

- `index` (number): Slide index (0-based)

**Example:**

```javascript
mostage.goToSlide(5); // Go to slide 6
```

### `toggleOverview()`

Toggles overview mode.

**Example:**

```javascript
mostage.toggleOverview();
```

### `destroy()`

Destroys the presentation and cleans up resources.

**Example:**

```javascript
mostage.destroy();
```

## Getters

### `getCurrentSlide()`

Gets the current slide index.

**Returns:** `number`

**Example:**

```javascript
const currentSlide = mostage.getCurrentSlide();
console.log(`Current slide: ${currentSlide + 1}`);
```

### `getTotalSlides()`

Gets the total number of slides.

**Returns:** `number`

**Example:**

```javascript
const totalSlides = mostage.getTotalSlides();
console.log(`Total slides: ${totalSlides}`);
```

### `getSlides()`

Gets all slides data.

**Returns:** `MoSlide[]`

**Example:**

```javascript
const slides = mostage.getSlides();
console.log(`First slide content: ${slides[0].content}`);
```

### `getContainer()`

Gets the container element.

**Returns:** `HTMLElement`

**Example:**

```javascript
const container = mostage.getContainer();
container.style.border = "1px solid red";
```

## Events

### `on(event, callback)`

Registers an event listener.

**Parameters:**

- `event` (string): Event name
- `callback` (function): Event callback function

**Available Events:**

- `ready`: Fired when presentation is ready
- `slidechange`: Fired when slide changes

**Example:**

```javascript
mostage.on("ready", (data) => {
  console.log("Presentation ready!");
  console.log(`Total slides: ${data.totalSlides}`);
});

mostage.on("slidechange", (data) => {
  console.log(`Slide changed to: ${data.currentSlide + 1}`);
  console.log(`Current slide: ${data.slide.title}`);
});
```

### `emit(event, data)`

Emits an event (internal use).

## Event Data

### Ready Event

```javascript
{
  type: "ready",
  currentSlide: 0,
  totalSlides: 10
}
```

### Slide Change Event

```javascript
{
  type: "slidechange",
  currentSlide: 5,
  totalSlides: 10,
  slide: {
    id: "slide-6",
    content: "# Slide 6",
    html: "<h1>Slide 6</h1>",
    notes: "Speaker notes"
  }
}
```

## Keyboard Shortcuts

| Key            | Action             |
| -------------- | ------------------ |
| `→` or `Space` | Next slide         |
| `←`            | Previous slide     |
| `Home`         | First slide        |
| `End`          | Last slide         |
| `O`            | Toggle overview    |
| `H` or `?`     | Toggle help        |
| `Esc`          | Exit overview/help |

## Touch Gestures

| Gesture     | Action          |
| ----------- | --------------- |
| Swipe left  | Next slide      |
| Swipe right | Previous slide  |
| Pinch       | Toggle overview |

## URL Hash Navigation

When `urlHash: true` is enabled:

- `#slide-1` - Go to slide 1
- `#slide-5` - Go to slide 5
- URL updates automatically when navigating

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

### Plugin Methods

- `init(mostage, config)` - Initialize plugin
- `destroy()` - Cleanup plugin resources
- `setEnabled(enabled)` - Enable/disable plugin

### Accessing Mostage Instance

```javascript
class MyPlugin {
  init(mostage, config) {
    // Get current slide
    const currentSlide = mostage.getCurrentSlide();

    // Get total slides
    const totalSlides = mostage.getTotalSlides();

    // Listen to events
    mostage.on("slidechange", (data) => {
      console.log("Slide changed!");
    });

    // Navigate programmatically
    mostage.goToSlide(5);
  }
}
```
