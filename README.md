# [Your Library Name] - Digital Library Template

Welcome to your new digital library! This template provides everything you need to create a beautiful, professional knowledge library using the Universalis ecosystem.

## ✨ What You Get

- **🚀 Modern Web Interface**: Fast, responsive design built with Astro
- **📚 Multi-Format Support**: PDF, audiobook, and ePub generation from markdown
- **🔧 Ecosystem Integration**: Works seamlessly with mdtexpdf, mdaudiobook, and mdepub
- **📱 Mobile-Friendly**: Perfect reading experience on all devices
- **🌐 Free Hosting**: Deploy to GitHub Pages at no cost
- **🎨 Fully Customizable**: Make it uniquely yours

## 🚀 Quick Start

We present a quick start guide to help you get started with your digital library. For a detailed guide, read the [Setup Guide](docs/SETUP_GUIDE.md).

### 1. Fork This Template
```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/yourusername/library.git
cd library
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Universalis Tools
```bash
# Install the ecosystem tools for content processing
ucli build mdtexpdf mdaudiobook mdepub
```

For more information, read the [Setup Guide](docs/SETUP_GUIDE.md).

### 4. Customize Your Library
```bash
# Interactive setup - guided customization
make setup-template

# Or create config files for manual editing
make setup-template-manual

# Apply your configuration changes
make build-config
```

> 💡 **New!** The interactive setup now includes logo upload support for PNG, JPG, and JPEG files. The system automatically handles format conversion and generates favicon, social preview images, and multiple sizes.

### 5. Add Your Content
Create markdown files in the `content/` directory:
```
content/
├── books/          # Full-length books
├── articles/       # Shorter articles  
└── guides/         # How-to guides
```

### 6. Build Everything
```bash
# Process your markdown into PDFs displayed in the PDF reader of the Library
make build-all
```

### 7. Deploy
```bash
git add .
git commit -m "Customize library with my content"
git push origin main

# Enable GitHub Pages in your repository settings
```

## 🏗️ Project Structure

```
your-library/
├── content/                    # Your markdown content (NEW!)
│   ├── books/                 # Full-length books
│   ├── articles/              # Articles and papers
│   └── guides/                # How-to guides
├── scripts/                   # Build and setup scripts (NEW!)
│   └── build-content.sh       # Ecosystem integration script
├── public/                    # Static assets
│   ├── images/               # Logo and images
│   ├── pdfs/                 # Generated PDFs (auto-created)
│   ├── audio/                # Generated audiobooks (auto-created)
│   └── epub/                 # Generated ePubs (auto-created)
├── src/                      # Website source code
│   ├── components/           # Reusable components
│   ├── data/                 # Content metadata
│   ├── layouts/              # Page layouts
│   ├── pages/                # Website pages
│   └── styles/               # CSS styles
├── Makefile                  # Ecosystem-integrated build system
└── README.md                 # This file
```

## 🧞 Commands

| Command              | Action                                           |
| :------------------- | :----------------------------------------------- |
| `make help`          | Show all available commands                      |
| `make install`       | Install dependencies                             |
| `make dev`           | Start development server at `localhost:4321`    |
| `make build`         | Build static website                             |
| `make build-content` | Process markdown with ecosystem tools            |
| `make build-pdf`     | Generate PDFs only (requires mdtexpdf)          |
| `make build-audio`   | Generate audiobooks only (requires mdaudiobook) |
| `make build-epub`    | Generate ePubs only (requires mdepub)           |
| `make build-all`     | Generate all formats + build website            |
| `make setup-template`        | Interactive template customization      |
| `make setup-template-manual` | Create config files for manual editing |
| `make build-config`          | Apply configuration changes             |
| `make reset-template`        | Reset to default template state         |
| `make clean`                 | Clean generated files                   |

## 🎨 Template Customization Workflow

This template uses a **configuration-driven approach** that makes customization safe and reversible:

### 🚀 Getting Started with Customization

```bash
# Option 1: Interactive setup (recommended for beginners)
make setup-template
# Follow the prompts to customize colors, fonts, branding, etc.

# Option 2: Manual configuration (for advanced users)
make setup-template-manual
# Edit files in library-config/ directory manually
```

### 📁 Configuration Structure

After running setup, you'll have a `library-config/` directory:

```
library-config/
├── branding.yaml          # Colors, fonts, logo, library name
├── deployment.yaml        # Domain, SEO, analytics settings
├── library-structure.md   # Content organization (TOC)
├── pages/                 # Static pages (about, contact, etc.)
│   ├── about.md
│   ├── contact.md
│   ├── privacy.md
│   └── terms.md
└── assets/               # Your logo, favicon, etc.
    └── README.md
```

### 🔄 Safe Experimentation

**The beauty of this system**: You can experiment without fear!

```bash
# Make changes to your config
vim library-config/branding.yaml

# Apply changes
make build-config

# Test your changes
make dev

# Don't like the result? Reset to clean template!
make reset-template
# ↑ This restores everything to the original working state
```

### 🛡️ Recovery and Reset

The `make reset-template` command is your **"panic button"**:

- ✅ **Safe**: Preserves your content in `content/` directory
- ✅ **Complete**: Removes all customizations and generated files
- ✅ **Automatic**: Rebuilds everything to working template state
- ✅ **Confirmed**: Asks for confirmation before making changes

**When to use reset:**
- You want to start customization over from scratch
- Something went wrong during customization
- You want to update to a newer version of the template
- You're experimenting and want a clean slate

### 🔄 Complete Workflow Example

```bash
# 1. Start with clean template
make dev  # See the default example library

# 2. Customize your library
make setup-template
# (Follow prompts to set colors, branding, etc.)

# 3. Apply and test
make build-config
make dev  # See your customized library

# 4. Add your content
# Edit files in content/ directory
# Update library-config/library-structure.md

# 5. Build everything
make build-all

# 6. Deploy
git add . && git commit -m "My customized library"
git push origin main

# 7. Want to start over? No problem!
make reset-template  # Back to clean template
```

## 🔧 Ecosystem Integration

This template is part of the **Universalis ecosystem** and integrates with:

- **[mdtexpdf](https://github.com/ucli-tools/mdtexpdf)**: Generate beautiful PDFs from markdown
- **[mdaudiobook](https://github.com/ucli-tools/mdaudiobook)**: Create professional audiobooks
- **[mdepub](https://github.com/ucli-tools/mdepub)**: Generate ePub ebooks
- **[ucli](https://github.com/ucli-tools/ucli)**: Universal command-line interface

### Install Ecosystem Tools
```bash
# Install ucli first
curl -sSL https://ucli.tools/install | bash

# Then install the publishing tools
ucli build mdtexpdf mdaudiobook mdepub
```

## 📚 Documentation

- [mdtexpdf Syntax Guide](docs/MDTEXPDF_SYNTAX.md) - Markdown and LaTeX syntax for PDF generation
- [Architecture Overview](docs/ARCHITECTURE.md) - Technical design and system architecture
- [Content Workflow](docs/CONTENT_WORKFLOW.md) - How to create and organize content

## 📄 License

**This project is licensed under the Apache 2.0 License** - see the [LICENSE](LICENSE) file for details.

### 🌐 Free and Open Source Software (FOSS)

This universal library template is part of the Universalis ecosystem's **dual licensing model**:

- **🌐 This Template (FOSS)**: Freely available under Apache 2.0 for anyone to use
- **🔒 Your Implementation**: You choose your own licensing for your specific content and customizations

**You are free to:**
- ✅ Use this template for any purpose (commercial or non-commercial)
- ✅ Modify and customize it for your needs
- ✅ Distribute your modifications
- ✅ Create proprietary implementations based on this template
- ✅ Sell content created with this template

## 🤝 Contributing

Contributions are welcome! This template benefits everyone when it gets better.

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 🆘 Support

- **Documentation**: Check the `content/` directory for guides
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join discussions in the Universalis ecosystem
- **Ecosystem Tools**: Each tool has its own documentation and support

## 🌟 Examples

See these libraries built with this template:
- *[Add your library here after customization]*
- *[Community examples welcome]*

---

**Ready to build your knowledge empire? 🚀**

Start by running `make help` to see all available commands, then `make setup-template` to begin customization!

## 📞 Contact

For questions about this template, please open an issue on [GitHub](https://github.com/ucli-tools/library/issues).