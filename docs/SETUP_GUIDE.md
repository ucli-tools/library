# Complete Setup Guide: From Fork to Published Library

This guide walks you through the complete process of creating your own digital library using the Universalis Library Template.

## 🎯 Overview: What You'll Achieve

By the end of this guide, you'll have:
- ✅ A fully customized digital library with your branding
- ✅ Professional PDF generation from markdown content
- ✅ Automated deployment to GitHub Pages
- ✅ Zero code editing required

**Time Required**: 30-45 minutes for complete setup

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Node.js 18+ installed
- Basic familiarity with markdown

## 🚀 Step-by-Step Guide

### Step 1: Fork the Template Repository

1. **Visit the template repository**: https://github.com/ucli-tools/library
2. **Click "Fork"** in the top-right corner
3. **Choose your GitHub account** as the destination
4. **Rename the repository** (optional): Change from "library" to your preferred name (e.g., "my-digital-library")
5. **Click "Create fork"**

### Step 2: Clone Your Fork Locally

```bash
# Replace 'yourusername' and 'your-repo-name' with your actual values
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### Step 3: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install the Universalis ecosystem tools (optional but recommended)
# These enable PDF, audiobook, and ePub generation
curl -sSL https://ucli.dev/install | bash
ucli build mdtexpdf mdaudiobook mdepub
```

### Step 4: Run Interactive Setup

This is where the magic happens! Our Phase 2 Interactive Setup System will guide you through customizing your library.

```bash
make setup-template
```

#### 4.1 Library Information
You'll be prompted for:
- **Library name**: "My Digital Library" (appears in header, title, etc.)
- **Tagline**: "Knowledge at your fingertips" (subtitle)
- **Description**: Brief description for SEO and social sharing
- **Your name**: Author name
- **Organization**: Your company/institution (optional)
- **Website**: Your personal/organization website

#### 4.2 Visual Design
Choose from 5 professionally designed themes:
1. **blue-professional** - Clean, corporate look (Primary: #2563eb)
2. **green-academic** - Academic, scholarly feel (Primary: #059669)
3. **purple-creative** - Creative, artistic vibe (Primary: #7c3aed)
4. **orange-warm** - Warm, inviting tone (Primary: #ea580c)
5. **gray-minimal** - Minimalist, clean design (Primary: #374151)

**Custom Colors** (optional):
- Customize primary, secondary, accent, background, and text colors
- All colors must be in hex format (e.g., #2563eb)

#### 4.3 Typography
Choose from professional font families:
1. **Inter** - Modern, highly readable
2. **Roboto** - Google's flagship font
3. **Open Sans** - Friendly, approachable
4. **Lato** - Humanist, warm
5. **Source Sans Pro** - Adobe's clean design

#### 4.4 Website Settings
- **Custom domain**: yourlibrary.com (optional)
- **SEO description**: Meta description for search engines
- **Keywords**: Comma-separated keywords for SEO

#### 4.5 Analytics (Optional)
- **Google Analytics**: Enter your GA4 tracking ID (G-XXXXXXXXXX)

#### 4.6 Deployment
- **GitHub Pages**: Enable automatic deployment
- **Custom domain**: Use your own domain name
- **Subdomain**: GitHub Pages subdomain (username.github.io/subdomain)

### Step 5: Add Your Logo (Optional)

```bash
# Add your logo to the assets directory
cp /path/to/your/logo.png library-config/assets/logo.png

# The system will automatically generate:
# - favicon.ico
# - apple-touch-icon.png
# - social preview images
# - Multiple sizes for different uses
```

### Step 6: Create Your Content

#### 6.1 Organize Your Content Structure

Edit `library-config/library-structure.md` to define your content organization:

```markdown
# Library Structure

- [Books](books)
  - [My First Book](books/my-first-book.md)
  - [Research Notes](books/research-notes.md)

- [Articles](articles)
  - [Technical Writing](articles/technical-writing.md)
  - [Philosophy Papers](articles/philosophy.md)

- [Resources](resources)
  - [Quick Reference](resources/quick-reference.md)
```

#### 6.2 Create Content Files

Create markdown files in the `content/` directory:

```bash
# Create directories
mkdir -p content/books content/articles content/resources

# Create your first book
cat > content/books/my-first-book.md << 'EOF'
---
title: "My First Book"
author: "Your Name"
date: "2025-01-20"
description: "An introduction to my digital library"
format: "article"
header_footer_policy: "all"
---

# My First Book

This is the beginning of my digital library journey...

## Chapter 1: Getting Started

Content goes here...
EOF
```

**Important**: Always include proper frontmatter with:
- `title`: Document title
- `author`: Your name
- `date`: Publication date
- `description`: Brief description
- `format: "article"`: For clean PDF formatting
- `header_footer_policy: "all"`: For professional headers/footers

### Step 7: Build Your Library

```bash
# Generate PDFs from your markdown content
make build-pdf

# Build the web interface
make build

# Start development server to preview
make dev
```

Visit `http://localhost:4321` to preview your library!

### Step 8: Deploy to GitHub Pages

#### 8.1 Configure GitHub Pages

1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll to "Pages" section**
4. **Source**: Deploy from a branch
5. **Branch**: Select `main` and `/ (root)`
6. **Click "Save"**

#### 8.2 Deploy Your Library

```bash
# Build for production
make build

# Commit and push your changes
git add .
git commit -m "Initial library setup with Phase 2 configuration"
git push origin main
```

Your library will be available at: `https://yourusername.github.io/your-repo-name`

#### 8.3 Custom Domain (Optional)

If you configured a custom domain during setup:

1. **Add CNAME record** in your DNS settings pointing to `yourusername.github.io`
2. **Wait for DNS propagation** (up to 24 hours)
3. **GitHub will automatically issue SSL certificate**

## 🎨 Customization After Setup

### Editing Configuration

All customization is done through configuration files in `library-config/`:

```
library-config/
├── branding.yaml          # Colors, fonts, logo, library info
├── deployment.yaml        # Domain, SEO, analytics
├── library-structure.md   # Content organization (TOC)
└── pages/                 # Static pages (about, contact, etc.)
    ├── about.md
    ├── contact.md
    ├── privacy-policy.md
    └── terms-conditions.md
```

### Making Changes

1. **Edit configuration files** in `library-config/`
2. **Apply changes**: `make build-config`
3. **Preview**: `make dev`
4. **Deploy**: `git add . && git commit -m "Update configuration" && git push`

### Example: Changing Colors

Edit `library-config/branding.yaml`:

```yaml
branding:
  colors:
    primary: "#7c3aed"     # Purple
    secondary: "#64748b"   # Gray
    accent: "#f59e0b"      # Amber
```

Then run: `make build-config`

## 🔧 Advanced Features

### Multi-Format Content Generation

Generate PDFs, audiobooks, and ePubs from the same markdown:

```bash
# Generate all formats
make build-all

# Generate specific formats
make build-pdf      # PDFs only
make build-audio    # Audiobooks only (requires Google Cloud TTS setup)
make build-epub     # ePubs only
```

### Content Validation

Validate your configuration:

```bash
make validate-config
```

### Reset to Default

If you want to start over:

```bash
make reset-template
```

## 🎯 Template Processing: How It Works

Our Phase 2 system uses **Handlebars-style syntax** for configuration-driven customization:

### Variables
```astro
<h1>{{ branding.library.name }}</h1>
<!-- Becomes: <h1>My Digital Library</h1> -->
```

### Conditionals
```astro
{{#if branding.logo.enabled}}
  <img src="{{ branding.logo.path }}" alt="{{ branding.logo.alt_text }}">
{{/if}}
```

### Loops
```astro
{{#each structure.categories}}
  <a href="/{{ slug }}">{{ name }}</a>
{{/each}}
```

### CSS Variables
Configuration automatically generates CSS variables:

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --font-primary: Inter, system-ui, sans-serif;
}
```

## 🚨 Troubleshooting

### Common Issues

**Configuration validation fails:**
```bash
make validate-config
# Check the error message and fix the configuration file
```

**Template processing fails:**
```bash
make build-config
# Check for syntax errors in configuration files
```

**PDFs not generating:**
```bash
# Ensure mdtexpdf is installed
ucli build mdtexpdf

# Check markdown frontmatter format
# Ensure files are listed in library-structure.md
```

**Development server won't start:**
```bash
# Reinstall dependencies
npm install

# Check Node.js version (requires 18+)
node --version
```

### Getting Help

1. **Check configuration**: `make validate-config`
2. **Review logs**: Look for error messages in terminal output
3. **Reset template**: `make reset-template` to start fresh
4. **GitHub Issues**: Report bugs at https://github.com/ucli-tools/library/issues

## 🎉 Success Criteria

You've successfully set up your digital library when:

- ✅ Your library loads at your GitHub Pages URL
- ✅ Navigation shows your custom categories
- ✅ PDFs generate with proper headers/footers
- ✅ Colors and fonts match your chosen theme
- ✅ Logo appears in header (if configured)
- ✅ SEO metadata is properly set

## 🚀 Next Steps

After your library is live:

1. **Add more content**: Create markdown files and update `library-structure.md`
2. **Customize pages**: Edit files in `library-config/pages/`
3. **Set up analytics**: Monitor traffic with Google Analytics
4. **Share your library**: Promote your digital knowledge repository
5. **Iterate and improve**: Use the configuration system to refine your design

## 🏛️ Philosophy: Simple Yet Effective

This setup embodies our vision of democratizing digital library creation through configuration instead of coding. You've just created a professional digital library by:

- **Answering questions** instead of writing code
- **Editing YAML files** instead of CSS/HTML
- **Using markdown** instead of complex markup
- **Configuring** instead of programming

Your library is now a **living system** that grows with your knowledge while maintaining professional presentation and accessibility.

Welcome to the future of knowledge sharing! 📚✨
