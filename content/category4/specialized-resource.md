---
title: "Specialized Resource: Template Customization Reference"
author: "[Your Name]"
date: "2024-01-30"
description: "A specialized reference guide for advanced template customization. This Category 4 example shows how to create comprehensive reference materials."
category: "category4"
---

# Specialized Resource: Template Customization Reference

**Category 4** is your space for specialized, reference-style content. This example demonstrates how to create comprehensive resources that serve as go-to references for your audience.

## What is Category 4?

Category 4 content serves as:

- **Reference Materials**: Comprehensive guides that users bookmark and return to
- **Technical Documentation**: In-depth explanations of complex topics
- **Resource Collections**: Curated lists, tools, and materials
- **Advanced Tutorials**: Step-by-step guides for experienced users

## Template Customization Guide

This section provides advanced customization options for your library template.

### Visual Customization

Your library supports both light and dark themes automatically. To customize colors:

1. **Edit CSS Variables**: Modify `src/styles/global.css`
2. **Brand Colors**: Update the `--link-color` variable for your brand
3. **Background Colors**: Adjust `--bg-color` and `--text-color` for themes

### Content Organization

To add a new category:

1. Create a new directory in `content/`
2. Add markdown files with proper frontmatter
3. Update `src/data/library_content.json`
4. Add navigation links in `src/components/Navigation.astro`

### Build System

The template uses `mdtexpdf` for PDF generation:

- **Command**: `make build-pdf`
- **Output**: `public/pdfs/`
- **Multi-format Support**: PDF, Audio, ePub, Web

## Best Practices

1. **Consistent Frontmatter**: Use standardized metadata across all files
2. **SEO Optimization**: Include descriptive titles and descriptions
3. **Mobile Responsiveness**: Test on various devices
4. **Performance**: Optimize for fast page loads

---

*This specialized resource demonstrates the depth and utility that Category 4 content can provide to your audience.*
