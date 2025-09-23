# Mostage

## Modern stage is a presentation framework

#### [ HTML | Markdown | Text ] to web-based slide

---

## Why?

- **Web-based** — Provide web-based presentation
- **Simple & Familiar** — Use the same syntax you know from GitHub, documentation, and blogs
- **Focus on Content** — Write content without worrying about design
- **Interactive Environment** — Use HTML features inside slides
- **Version Control Friendly** — Track changes with Git, collaborate easily
- **Fast** — No complex editors or heavy applications needed

---

## Key Features

- **Simple** → Create slides with HTML, Markdown or plain text
- **Web-based** → Presentations run in browser
- **Configuration** → Easy to configure and customize
- **Theme System** → Built-in and custom themes
- **Plugin System** → Built-in and custom plugins

---

## Content Types

### HTML Parser

HTML to powerful slide with interactive elements and custom styling
[Demo HTML Parser](../html-demo/)

### Markdown Parser

Convert Markdown to powerful slide
[Demo Markdown Parser](../markdown-demo/)

### Text Parser

Convert plain text to simple slide
[Demo Text Parser](../text-demo/)

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
.mostage-slide {
  background: #808080;
  border: 1px solid var(--mostage-border-color);
}

.mostage-slide h1,
.mostage-slide h2 {
  color: var(--mostage-primary-color);
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
- `o` / `Escape`: Toggle overview mode
- `Swipe`: Navigate on mobile

---

## Feature Comparison

| Feature              | HTML | Markdown | Text |
| -------------------- | :--: | :------: | :--: |
| Headings             |  ✅  |    ✅    |  ✅  |
| Lists                |  ✅  |    ✅    |  ✅  |
| Code Blocks          |  ✅  |    ✅    |  ❌  |
| Tables               |  ✅  |    ✅    |  ❌  |
| Images               |  ✅  |    ✅    |  ❌  |
| Links                |  ✅  |    ✅    |  ❌  |
| Styling              |  ✅  |    ➖    |  ❌  |
| Interactive Elements |  ✅  |    ❌    |  ❌  |
| Media (Audio/Video)  |  ✅  |    ❌    |  ❌  |

---

## Happy presenting with Mostage!

##### Get started now: [mo.js.org](https://mo.js.org)

##### Or check the demo: [Parser demo #4](#4)

<!-- confetti -->
