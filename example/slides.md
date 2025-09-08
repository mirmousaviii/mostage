# Mostage

## Modern slides based on Markdown

---

## Key Features

- **Markdown-based** → Create slides with plain text
- **Web-first** → Presentations run in any browser
- **Configuration-based Plugin System** → Easy to configure and customize
- **Advanced Themes** → Multiple built-in and custom themes
- **Smooth Transitions** → Professional animations with custom timing

---

## Default Themes

- **Light Theme** → Perfect for professional presentations and bright environments
- **Dark Theme** → Ideal for code presentations and low-light conditions
- **Solarized Theme** → Carefully crafted palette with scientific balance
- **Dracula Theme** → Popular dark theme with vibrant accents
- **Ocean Theme** → Inspired by the sea — calm, elegant, and refreshing

#### And, Create a new theme is easy

---

## Plugin System

###### Built-in plugins:

- **ProgressBar** → Shows presentation progress
- **SlideNumber** → Displays current slide number
- **Controller** → Navigation buttons
- **OverviewMode** → Grid view with animations

###### You can add your own plugins easily:

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

## Navigation

#### Keyboard Controls

- `Arrow Right` / `Space`: Next slide
- `Arrow Left`: Previous slide
- `Home`: First slide
- `End`: Last slide
- `o` / `Escape`: Toggle overview mode (OverviewMode plugin)
- `Swipe`: Navigate on mobile

---

## Markdown Parser

```markdown
# Header 1

## Header 2

### Header 3

#### Header 4

##### Header 5

###### Header 6

This is an example of text.

**Bold**, _Italic_, **_Bold Italic_**, [Link](https://mo.js.org)

> This is a blockquote. It is used to highlight a section of text.

- **Unordered List:**
  - Item 1
  - Item 2
    - Subitem 2.1
    - Subitem 2.2
- **Ordered List:**
  1. First item
  2. Second item
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

_Italic_, **Bold**, **_Bold Italic_**, [Link](https://mo.js.org)

> This is a blockquote. It is used to highlight a section of text.

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

## Happy presenting with Mostage!

#### **Get started now:** [mo.js.org](https://mo.js.org)
