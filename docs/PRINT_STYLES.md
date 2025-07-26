# Print Styles Documentation

## Overview

This project includes comprehensive print styles to ensure optimal printing experience for blog posts, resumes, and other content. The print styles are organized into multiple files for better maintainability.

## File Structure

### Print CSS Files

- `src/styles/print.css` - Main print styles for blog posts and general content
- `src/styles/print-utilities.css` - Utility classes for print-specific styling

### Configuration Files

- `stylelint.config.js` - CSS linting configuration
- `.vscode/settings.json` - VSCode CSS validation settings
- `.vscode/css-custom-data.json` - Custom CSS property definitions

## Print Color Adjust Property

### Standard Property
```css
print-color-adjust: exact | economy;
```

### Vendor Prefix
```css
-webkit-print-color-adjust: exact | economy;
```

### Usage
Always use both properties for maximum browser compatibility:

```css
/* Correct Usage */
.element {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

### Values

- `exact` - Colors should be printed exactly as specified
- `economy` - Browser may adjust colors to save ink/toner

## Print Utility Classes

### Color Adjustment
- `.print-color-exact` - Force exact color printing
- `.print-color-economy` - Allow color adjustment for economy

### Display Control
- `.print-only` - Show only when printing
- `.screen-only` - Hide when printing

### Page Breaks
- `.print-page-break-before` - Force page break before element
- `.print-page-break-after` - Force page break after element
- `.print-page-break-inside-avoid` - Avoid page breaks inside element

### Typography
- `.print-font-serif` - Use serif font for printing
- `.print-font-sans` - Use sans-serif font for printing
- `.print-font-mono` - Use monospace font for printing
- `.print-text-small` - 10pt font size
- `.print-text-base` - 12pt font size (base)
- `.print-text-large` - 14pt font size

### Layout
- `.print-container` - Reset container for print
- `.print-section` - Standard section spacing
- `.print-subsection` - Subsection spacing

## CSS Linting

### Running Linters
```bash
# Lint CSS files
npm run lint:css

# Fix CSS issues automatically
npm run lint:css:fix

# Lint everything (JS + CSS)
npm run lint:all
```

### Stylelint Rules

The project uses Stylelint with the following configurations:
- `stylelint-config-standard` - Standard CSS rules
- `stylelint-config-recess-order` - Property ordering rules
- `stylelint-order` - Custom ordering rules

### VSCode Integration

The project includes VSCode settings for:
- CSS validation
- Custom property recognition
- Stylelint integration
- Error highlighting

## Common Print CSS Patterns

### Basic Print Reset
```css
@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### Hide Interactive Elements
```css
@media print {
  button,
  .interactive,
  .no-print {
    display: none !important;
  }
}
```

### Page Layout
```css
@page {
  margin: 2cm;
  size: A4;
}
```

### Typography for Print
```css
@media print {
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.4;
    color: black;
  }
}
```

## Browser Support

### Print Color Adjust Support
- ✅ Chrome/Chromium (with `-webkit-` prefix)
- ✅ Safari (with `-webkit-` prefix)
- ✅ Firefox (standard property)
- ✅ Edge (both prefix and standard)

### Best Practices

1. **Always use both properties** for maximum compatibility
2. **Test in different browsers** as print behavior varies
3. **Use semantic HTML** for better print accessibility
4. **Optimize for A4 paper size** as the most common format
5. **Consider ink economy** when choosing colors and backgrounds

## Troubleshooting

### Common Issues

1. **Colors not printing**
   - Ensure `print-color-adjust: exact` is set
   - Check browser print settings

2. **Layout broken in print**
   - Use `page-break-inside: avoid` for important content
   - Test with different paper sizes

3. **Fonts not rendering**
   - Use web-safe fonts for print
   - Provide fallbacks

### Debugging Print Styles

1. Use browser's print preview
2. Test with actual printing
3. Use CSS `@page` rules for page-specific styling
4. Check print settings in different browsers

## Updates and Maintenance

### Adding New Print Styles

1. Add to appropriate CSS file
2. Run linting: `npm run lint:css`
3. Test in print preview
4. Update documentation if needed

### Updating Browser Support

1. Check [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)
2. Update browser support list
3. Adjust vendor prefixes if needed
4. Test in target browsers
