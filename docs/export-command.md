# Export Command Reference

The `mostage export` command allows you to export presentations in various formats for sharing, printing, and distribution.

## Syntax

```bash
mostage export [options]
```

## Options

| Option                  | Description      | Default   | Values                              |
| ----------------------- | ---------------- | --------- | ----------------------------------- |
| `--format, -f <format>` | Export format    | `html`    | `html`, `pdf`, `pptx`, `png`, `jpg` |
| `--output, -o <dir>`    | Output directory | `exports` | Any valid directory path            |

## Examples

### Basic Usage

```bash
# Export as HTML (default)
mostage export

# Export as PDF
mostage export --format pdf

# Export as PowerPoint
mostage export --format pptx

# Export as PNG images
mostage export --format png

# Export as JPG images
mostage export --format jpg
```

### Advanced Usage

```bash
# Custom output directory
mostage export --format pdf --output ./my-exports

# Export to specific directory
mostage export --format pptx --output ./presentations

# Multiple exports
mostage export --format pdf --output ./dist
mostage export --format pptx --output ./dist
```

## Output Structure

Each export format creates its own subdirectory:

```
exports/
├── html/
│   └── index.html          # Self-contained HTML
├── pdf/
│   └── presentation.pdf    # PDF document
├── pptx/
│   └── presentation.pptx   # PowerPoint file
├── png/
│   ├── slide-1.png         # Individual slides
│   ├── slide-2.png
│   └── ...
└── jpg/
    ├── slide-1.jpg          # Individual slides
    ├── slide-2.jpg
    └── ...
```

## Format Details

### HTML Export

- **File**: `index.html`
- **Features**: Self-contained, responsive, interactive
- **Use Case**: Web sharing, embedding

### PDF Export

- **File**: `presentation.pdf`
- **Features**: High-quality, print-ready, vector-based
- **Use Case**: Printing, sharing, archiving

### PPTX Export

- **File**: `presentation.pptx`
- **Features**: Full formatting, images, backgrounds
- **Use Case**: Editing, collaboration

### PNG Export

- **Files**: `slide-1.png`, `slide-2.png`, etc.
- **Features**: High-resolution, transparency support
- **Use Case**: Social media, thumbnails

### JPG Export

- **Files**: `slide-1.jpg`, `slide-2.jpg`, etc.
- **Features**: Smaller file size, no transparency
- **Use Case**: Web use, smaller file size

## Dependencies

The export command requires additional dependencies:

```bash
# Install dependencies
npm install puppeteer pptxgenjs sharp
```

**Required for:**

- **PDF/PNG/JPG**: `puppeteer` (headless browser)
- **PPTX**: `pptxgenjs` (PowerPoint generation)
- **Image processing**: `sharp` (image optimization)

## Troubleshooting

### Common Issues

**Export fails with "Module not found"**

```bash
# Install missing dependencies
npm install puppeteer pptxgenjs sharp
```

**PDF export fails**

- Check if Puppeteer can launch Chrome
- Verify file permissions
- Check for JavaScript errors in presentation

**PPTX export is empty**

- Verify slide content exists
- Check image paths are accessible
- Ensure proper slide structure

**Image export shows duplicates**

- Check slide selectors
- Verify CSS conflicts
- Ensure proper slide rendering

### Performance Tips

- **Large presentations**: Export formats separately
- **Memory usage**: Close browser between exports
- **File size**: Use JPG for smaller images
- **Quality**: Use PNG for better quality

## Integration

### CI/CD Pipeline

```yaml
# GitHub Actions
- name: Export Presentation
  run: |
    npm install -g mostage
    mostage export --format pdf --output ./dist
    mostage export --format pptx --output ./dist
```

### Build Scripts

```json
{
  "scripts": {
    "export:pdf": "mostage export --format pdf --output ./dist",
    "export:pptx": "mostage export --format pptx --output ./dist",
    "export:all": "mostage export --format pdf && mostage export --format pptx"
  }
}
```

### Batch Export

```bash
#!/bin/bash
# Export all formats
formats=("html" "pdf" "pptx" "png" "jpg")
for format in "${formats[@]}"; do
  mostage export --format $format --output ./exports
done
```

## Best Practices

1. **Test exports** before sharing
2. **Organize outputs** in separate directories
3. **Verify content** accuracy in all formats
4. **Document processes** for team members
5. **Version control** export outputs separately

## Limitations

- **SVG images**: Converted to text in PPTX
- **Animations**: Not preserved in static formats
- **Interactive elements**: Limited in PDF/PPTX
- **Custom fonts**: May require installation for PPTX editing
- **Large files**: May require more memory for processing
