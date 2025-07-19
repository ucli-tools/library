# Template Content

This directory contains example content for your digital library template. All content is written in markdown format and uses the Universalis ecosystem tools for processing.

## Directory Structure

```
content/
├── books/          # Full-length books and comprehensive guides
├── articles/       # Shorter articles and focused topics  
├── guides/         # How-to guides and tutorials
└── README.md       # This file
```

## Content Format

All content files should use this frontmatter format:

```markdown
---
title: "Your Content Title"
author: "[Your Name]"
date: "2024-01-01"
description: "Brief description of the content"
category: "Books|Articles|Guides"
tags: ["tag1", "tag2", "tag3"]
version: "1.0"
---

# Your Content Title

Your markdown content here...
```

## Processing Content

Use the Universalis ecosystem tools to generate multiple formats:

### Generate PDFs
```bash
# Single file
mdtexpdf content/books/your-book.md

# All content
make build-pdf
```

### Generate Audiobooks
```bash
# Single file
mdaudiobook content/books/your-book.md

# All content
make build-audio
```

### Generate ePubs
```bash
# Single file
mdepub content/books/your-book.md

# All content
make build-epub
```

### Generate All Formats
```bash
make build-all
```

## Customizing Content

1. **Replace Example Content**: Delete the example files and add your own
2. **Update Categories**: Modify directory structure as needed
3. **Customize Metadata**: Update frontmatter fields for your content
4. **Add New Sections**: Create new directories and update build scripts

## Content Guidelines

- **Consistent Frontmatter**: Use the same metadata format across all files
- **Clear Titles**: Make titles descriptive and searchable
- **Good Descriptions**: Write compelling descriptions for library display
- **Relevant Tags**: Use tags that help users find related content
- **Version Control**: Update version numbers when making significant changes

## Integration with Library

Your processed content automatically integrates with the library web interface:

- **PDFs**: Display in the built-in PDF viewer
- **Audio**: Stream through the audio player
- **ePubs**: Available for download
- **Metadata**: Powers search and navigation

---

*Start creating your knowledge library!*
