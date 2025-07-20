# mdtexpdf Markdown Syntax Guide

This guide documents the precise markdown syntax and best practices for creating content that works seamlessly with mdtexpdf for PDF generation, VS Code preview, and LaTeX rendering.

## Overview

mdtexpdf converts markdown files with LaTeX math into professional PDFs. To ensure compatibility across VS Code preview, LaTeX rendering, and PDF generation, follow these syntax guidelines.

## Mathematical Content

### Block-Level Math (Display Equations)

Use `$$ ... $$` delimiters for display equations, derivations, or important formulas:

```markdown
The quadratic formula is:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Where:
- $a$, $b$, and $c$ are coefficients
- $x$ represents the solutions
```

**Key Requirements:**
- Math content must be on its own line
- Blank line before and after the `$$` block
- No raw LaTeX outside of delimiters

### Inline Math

Use single dollar signs `$...$` for symbols or short expressions within sentences:

```markdown
The value of $\pi$ (pi, pronounced "pie") is approximately 3.14159, and Euler's identity $e^{i\pi} + 1 = 0$ connects five fundamental mathematical constants.
```

### Variable Explanations

Always explain mathematical variables and symbols for accessibility:

```markdown
The Schrödinger equation:

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

Where:
- $i$ is the imaginary unit (square root of -1)
- $\hbar$ (h-bar, pronounced "h-bar") is the reduced Planck constant
- $\Psi$ (psi, pronounced "sigh") is the wave function
- $\mathbf{r}$ represents position coordinates
- $t$ represents time
- $\hat{H}$ (H-hat) is the Hamiltonian operator
```

## Document Structure

### Required Frontmatter

Every markdown file must include clean, simple YAML frontmatter. **Avoid excessive visual formatting** (long lines of `=` characters, complex comments) as these can interfere with mdtexpdf's metadata parsing.

```markdown
---
# Common metadata
title: "Your Document Title"
author: "Your Name"
date: "2024-01-15"
description: "Brief description for the library"

# PDF settings
format: "article"  # or "book", "guide", etc.
no_numbers: false
header_footer_policy: "all"
footer: "© 2024 Your Organization. All rights reserved."
pageof: true
date_footer: true

# Library metadata
type: "article"
category: "your-category"
slug: "your-document-slug"
summary: "Brief description for the library"
tags: ["mathematics", "physics", "tutorial"]
---

# Your Document Title

Content begins here...
```

**Key Points:**
- Use simple `# Comment` format, not complex visual separators
- Keep metadata clean and readable
- Include `pageof: true` for "x/y" page numbering format
- Set `date_footer: true` to show date in footer
- Use `header_footer_policy: "all"` for consistent headers/footers

### Spacing Requirements

**Critical:** Maintain proper spacing for LaTeX compatibility:

```markdown
# Heading

This is a paragraph.

This is another paragraph with inline math $E = mc^2$.

The following is an example:

1. First item

2. Second item

3. Third item

Then another paragraph continues.
```

**Rules:**
- Empty line between paragraphs
- Empty line between paragraph and bullet/numbered lists
- Empty line between heading and first line of section
- Empty line before and after bullet point sections
- Empty line before and after numbered lists

### Lists and Enumerations

Use `-` for bullet points (not `*`):

```markdown
Key principles:

- First principle

- Second principle

- Third principle

Next paragraph continues here.
```

For numbered lists, ensure proper spacing:

```markdown
The process involves:

1. Initial setup

2. Configuration

3. Final verification

This ensures proper LaTeX rendering.
```

## LaTeX Symbols and Expressions

### Common Mathematical Symbols

```markdown
- Greek letters: $\alpha$, $\beta$, $\gamma$, $\delta$, $\pi$, $\phi$, $\psi$
- Operators: $\sum$, $\prod$, $\int$, $\partial$, $\nabla$
- Relations: $\leq$, $\geq$, $\neq$, $\approx$, $\equiv$
- Sets: $\in$, $\subset$, $\cup$, $\cap$, $\emptyset$
- Logic: $\land$, $\lor$, $\neg$, $\implies$, $\iff$
```

### Complex Expressions

```markdown
Matrix notation:

$$
\mathbf{A} = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}
$$

Integral with limits:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## VS Code Preview Compatibility

### Setup for VS Code

1. Install "Markdown All in One" extension
2. Install "Markdown+Math" extension for LaTeX rendering
3. Use Ctrl+Shift+V (or Cmd+Shift+V on Mac) to preview

### Preview Tips

- Math renders properly with correct spacing
- Frontmatter is hidden in preview
- PDF links work in preview mode
- Export to HTML preserves math formatting

## Common Pitfalls

### Avoid These Mistakes

❌ **Wrong:**
```markdown
The equation $E=mc^2$ shows energy-mass equivalence.
No spacing here.
$$E = mc^2$$
Another paragraph immediately.
```

✅ **Correct:**
```markdown
The equation $E = mc^2$ shows energy-mass equivalence.

The full derivation is:

$$
E = mc^2
$$

This fundamental equation relates energy and mass.
```

### Section Separators

❌ **Don't use:** `---` for section separators (conflicts with frontmatter)

✅ **Use:** Proper headings instead:
```markdown
## Section One

Content here.

## Section Two

More content here.
```

## Testing Your Content

### Before Committing

1. **VS Code Preview:** Verify math renders correctly
2. **Spacing Check:** Ensure proper blank lines throughout
3. **Frontmatter:** Validate YAML syntax
4. **PDF Generation:** Test with `make build-pdf`

### Validation Commands

```bash
# Test single file
cd content/your-category
mdtexpdf convert your-file.md

# Test all TOC files
make build-pdf

# Preview in browser
make dev
```

## Best Practices Summary

1. **Always use frontmatter** with required fields
2. **Explain all mathematical symbols** with pronunciation
3. **Maintain consistent spacing** throughout document
4. **Use `$...$` for inline math** and `$$...$$` for display math
5. **Test in VS Code preview** before committing
6. **Keep math expressions clean** and well-formatted
7. **Use descriptive variable names** when possible
8. **Include units** for physical quantities

## Example Template

```markdown
---
# Common metadata
title: "Example Mathematical Document"
author: "Your Name"
date: "2024-01-15"
description: "Demonstrates proper mdtexpdf syntax"

# PDF settings
format: "article"
no_numbers: false
header_footer_policy: "all"
footer: "© 2024 Your Organization. All rights reserved."
pageof: true
date_footer: true

# Library metadata
type: "article"
category: "examples"
slug: "example-mathematical-document"
summary: "Demonstrates proper mdtexpdf syntax"
tags: ["mathematics", "example"]
---

# Example Mathematical Document

This document demonstrates proper syntax for mdtexpdf compatibility.

## Introduction

Mathematics requires precise notation. The fundamental theorem states:

$$
\int_a^b f'(x) dx = f(b) - f(a)
$$

Where:
- $f(x)$ is a differentiable function
- $a$ and $b$ are the integration limits
- $f'(x)$ (f-prime) is the derivative of $f(x)$

## Key Principles

The following principles guide our approach:

1. Clarity in mathematical expression

2. Proper spacing for LaTeX compatibility

3. Comprehensive variable explanations

This ensures accessibility for all readers.

## Conclusion

Following these guidelines ensures seamless PDF generation and excellent readability.
```

This template provides a solid foundation for creating mdtexpdf-compatible content that renders beautifully in VS Code preview and generates professional PDFs.
