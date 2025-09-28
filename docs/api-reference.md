# API Reference

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

## URL Hash Navigation

When `urlHash: true` is enabled:

- `#1` - Go to slide 1
- `#5` - Go to slide 5
- URL updates automatically when navigating
