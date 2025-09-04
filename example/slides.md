# Mostage

## Modern slides based on Markdown

---

## Key Features

- **Markdown-based** → Create slides with plain text  
- **Web-first** → Presentations run in any browser  
- **Plugin System** → Extensible and customizable  
- **Themes** → Multiple built-in and custom themes  
- **Smooth Transitions** → Professional animations  

---

## Simple usage

```javascript
import Mostage from "mostage";

const mostage = new Mostage({
    element: "#app",
    theme: "dark",
    plugins: ["ProgressBar", "SlideNumber", "Controller", "OverviewMode"],
    markdown: "./slides.md"
});

mostage.start();
```

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

```ts
class CustomPlugin {
  name = 'CustomPlugin';
  
  init(mo) {
    console.log('Plugin initialized!');
  }

  destroy() {
    console.log('Plugin destroyed!');
  }
}
```

---

## Navigation

#### Keyboard Controls
- **Space** → Next slide
- **Left Arrow (←)** → Previous slide  
- **Right Arrow (→)** → Next slide      
- **O** or **Esc** → Toggle overview mode    

#### Touch Controls
- **Swipe** → Navigate on mobile  
- **Tap** → Next slide  

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

**Bold**, *Italic*, ***Bold Italic***, [Link](https://mo.js.org)

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

*Italic*, **Bold**, ***Bold Italic***, [Link](https://mo.js.org)

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