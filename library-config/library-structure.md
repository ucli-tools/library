# Library Structure

This file defines the organization and navigation of your digital library.
Edit this file to customize your categories and content organization.

## Content Categories

- [Category 1](category1)
  - [Introduction to Category 1](category1/introduction-to-category1.md)
  - [Mathematical Concepts Example](category1/mathematics-example.md)

- [Category 2](category2)
  - [Working with Articles in Category 2](category2/working-with-articles.md)

- [Category 3](category3)
  - [Advanced Guide: Building Your Content Strategy](category3/advanced-guide-example.md)

- [Category 4](category4)
  - [Specialized Resource: Template Customization Reference](category4/specialized-resource.md)

---

## How to Customize

### Rename Categories
Change the category names to match your content:
```markdown
- [Books](books)
- [Articles](articles)
- [Research](research)
- [Resources](resources)
```

### Add New Content
Add new content by referencing the markdown file:
```markdown
- [Books](books)
  - [My First Book](books/my-first-book.md)
  - [Another Book](books/another-book.md)
```

### Reorganize Structure
You can create subcategories and reorganize as needed:
```markdown
- [Fiction](fiction)
  - [Novels](fiction/novels)
    - [My Novel](fiction/novels/my-novel.md)
  - [Short Stories](fiction/stories)
    - [Story Collection](fiction/stories/collection.md)
```

### Notes
- The build system will automatically detect corresponding PDF files
- Category slugs (the part in parentheses) become URL paths
- Content files should exist in the `content/` directory
- PDFs should exist in the `public/pdfs/` directory with matching paths
