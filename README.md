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

### 1. Fork This Template
```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/yourusername/your-library-name.git
cd your-library-name
```

### 2. Install Dependencies
```bash
make install
```

### 3. Install Universalis Tools
```bash
# Install the ecosystem tools for content processing
ucli build mdtexpdf mdaudiobook mdepub
```

### 4. Customize Your Library
```bash
# Start the interactive setup (coming soon)
make setup-template

# Or manually customize:
# - Replace public/images/library_logo.png with your logo
# - Edit this README.md with your information
# - Add your content to the content/ directory
```

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
# Process your markdown into multiple formats
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
| `make setup-template`| Interactive template customization              |
| `make clean`         | Clean generated files                           |

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

For questions about this template, please open an issue on GitHub or contact the maintainers.

## Code

For an open-source version of the Library, check the [UCLI-Tools Library](https://github.com/ucli-tools/library).
