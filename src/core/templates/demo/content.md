<h1>
  <img src="./images/logo.svg" alt="#" style="
  display: inline;
  vertical-align: middle;
  width: 4.25rem;
  margin-top: 0.625rem;
  ">
Mostage
</h1>

## Generate web slides by Markdown

<h4>
  <span style="color: var(--mostage-primary-color)">
    <span style="border-bottom: 1px solid var(--mostage-primary-color); padding-bottom: 3px;">Mo</span>dern
  </span>
  <span style="color: var(--mostage-primary-color)">
    <span style="border-bottom: 1px solid var(--mostage-primary-color); padding-bottom: 3px;">stage</span>
  </span>
  as a Presentation Framework
</h4>

---

## Why?

- **Web-based** — Provide web-based presentation
- **Simple & Familiar** — Use the same syntax you know from GitHub, documentation, and blogs
- **Focus on Content** — Write content without worrying about design
- **Interactive Environment** — Use HTML features inside slides
- **Fast** — No complex editors or heavy applications needed
- **Version Control Friendly** — Track changes with Git, collaborate easily

---

## Key Features

- **Markdown & HTML** → Create slides with Markdown and HTML
- **Library & CLI** — Use as a CLI tool or integrate as a library
- **Web-based** → Presentations run in browser
- **Configuration** → Easy to configure and customize
- **Theme System** → Built-in and custom themes
- **Plugin System** → Built-in and custom plugins

---

## CLI

Create and manage presentations with ease

```bash
# Create a new project
mostage new

# Start development server
mostage dev

# Export to different formats
mostage export --format pdf
mostage export --format pptx
mostage export --format png
mostage export --format html
```

---

## Built-in Themes

- **Light Theme** → Classic presentations
- **Dark Theme** → Ideal for code presentations and low-light conditions
- **Dracula Theme** → Popular dark theme with vibrant accents
- **Ocean Theme** → Inspired by the sea. calm, elegant, and refreshing
- **Rainbow Theme** → Colorful and bright theme with vibrant colors

#### And, Create a new theme is easy

---

## Theme System

You can add your own themes easily

```css
:root {
  --mostage-bg-color: #0f0f23;
  --mostage-text-color: #e2e8f0;
  --mostage-primary-color: #667eea;
  --mostage-secondary-color: #764ba2;
  --mostage-accent-color: #fbb6ce;
  --mostage-border-color: #4a5568;
  --mostage-highlight-color: #63b3ed;
}
.mostage-slide {
  background: #808080;
  border: 1px solid var(--mostage-border-color);
}
```

---

## Built-in Plugins

- **ProgressBar** → Shows presentation progress
- **SlideNumber** → Displays current slide number
- **Controller** → Navigation buttons
- **OverviewMode** → Grid view with all slides
- **Confetti** → Celebration animations controlled

#### And, Create a plugins is easy

---

## Plugin System

You can add your own plugins easily

```javascript
class CustomPlugin {
  name = "CustomPlugin";

  init(mo) {
    console.log("Plugin initialized!");
  }

  destroy() {
    console.log("Plugin destroyed!");
  }
}
```

---

## Celebration!

#### **Confetti** as an example of plugin

<!-- confetti -->

---

## Navigation

#### Keyboard Controls

- `Arrow Right` / `Space`: Next slide
- `Arrow Left`: Previous slide
- `Home`: First slide
- `End`: Last slide
- `O` / `Escape`: Toggle overview mode
- `Swipe`: Navigate on mobile
- `H` / `?`: Toggle help window

---

## Markdown Parser

#### Convert Markdown or HTML to powerful slide

```markdown
# Header Example 1

## Header Example 2

### Header Example 3

#### Header Example 4

##### Header Example 5

###### Header Example 6

This is an example of text.

**Bold**, _Italic_, **_Bold Italic_**, ~~strikethrough~~

[Link](https://mo.js.org)

> This is an example of blockquote.
```

---

# Header Example 1

## Header Example 2

### Header Example 3

#### Header Example 4

##### Header Example 5

###### Header Example 6

---

## Text Formatting Example

This is an example of text.

_Italic_, **Bold**, **_Bold Italic_**, ~~strikethrough~~, [Link](https://mo.js.org)

> This is an example of blockquote.

**Inline Code:** `console.log('Hello, World!');`

---

## List Example

- **Unordered List:**
  - Item 1
    - Subitem 1.1
    - Subitem 1.2
  - Item 2
    - Subitem 2.1
    - Subitem 2.2
- **Ordered List:**
  1. First item
     1. Subitem 1.1
     2. Subitem 1.2
  2. Second item
     1. Subitem 2.1
     2. Subitem 2.2

---

## Code Examples

Here is example of **code**

```html
<div class="example">
  <!-- This should not be parsed -->
  <p>HTML tags should be escaped</p>
</div>
```

**Inline Code:** `console.log('Hello, World!');`

---

## Image Support

![Image sample](https://mirmousaviii.github.io/mostafa-hugo-theme/gallery/sample-gallery/image01_hu_7f95ea883e7ec554.png)

```markdown
![alt](src)
```

---

## Tables

| Feature             | Status | Notes                                                |
| ------------------- | :----: | ---------------------------------------------------- |
| Markdown Parser     |   ✅   | Core feature: Parses and renders Markdown content    |
| HTML Support        |   ✅   | Allows raw HTML for advanced customization           |
| Theme System        |   ✅   | Supports light/dark and custom themes                |
| Plugin System       |   ✅   | Extend functionality with plugins                    |
| CLI Commands        |   ✅   | Create, develop, and export presentations            |
| Keyboard Navigation |   ✅   | Navigate slides with keyboard shortcuts              |
| Overview            |   ✅   | Slide overview/mini-map for quick navigation         |
| Page Number         |   ✅   | Shows current/total slide number via plugin          |
| Header & Footer     |   ✅   | Customizable header and footer for slides            |
| Export Formats      |   ✅   | Export to HTML, PDF, PPTX, PNG, JPG                  |
| Speaker Note        |   ⬜   | Planned: Add private notes for presenters            |
| Presenter Mode      |   ⬜   | Planned: Dual-screen mode for presenter and audience |

---

<h2>HTML Features</h2>

HTML Form

<div style="display: flex; align-items: center; gap: 0.3em;">
  <input id="myInput" style="padding: 0.2em 0.5em; border: 1px solid #bbb; border-radius: 3px; font-size: 0.95em; height: 2em;">
  <button 
    style="padding: 0.2em 0.8em; background:rgb(94, 33, 224); color: #fff; border: none; border-radius: 3px; font-size: 0.95em; height: 2em; cursor: pointer;"
    onclick="document.getElementById('message').innerText = 'You entered: ' + document.getElementById('myInput').value;"
  >
    Test
  </button>
</div>
<br/>
<div id="message">
</div>

---

<h2>Media Elements</h2>

<audio controls style="max-width: 100%;">
  <source
    src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    type="audio/wav"
  />
  Your browser does not support the audio element.
</audio>

<br/>

<video controls style="max-width: 100%; height: auto;" width="400" height="300">

  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
  Your browser does not support the video element.
</video>

---

<h2>Styling Examples</h2>

<p style="color: #ff6b6b">Red text</p>
<p style="color: #4ecdc4">Teal text</p>
<p style="color: #45b7d1">Blue text</p>

<div style="background-color: #45b7d1; padding: 1rem; border-radius: 8px">
  <p>This is a styled div with background color and padding.</p>
</div>

---

## JSON Configuration

You can load your configuration from a separate JSON file:

```javascript
// Method 1: Load configuration from JSON file
const mostage = new Mostage("./config.json");

// Method 2: Inline configuration
const mostage = new Mostage({
  element: "#app",
  theme: "dark",
  contentPath: "./content.md",
  header: {
    content: "### Header",
  },
  footer: {
    contentPath: "./footer.md",
    showOnFirstSlide: true,
  },
  plugins: {
    SlideNumber: {
      enabled: true,
      position: "bottom-right",
      format: "current/total",
    },
  },
});
```

---

## Happy presenting with Mostage!

##### Focus on content with advance features

###### Get started now: [mo.js.org](https://mo.js.org)

<!-- confetti -->
