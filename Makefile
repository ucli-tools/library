# Universalis Library Template Makefile
# Integrates with the complete Universalis ecosystem

.PHONY: help install dev build build-content build-pdf build-audio build-epub build-all setup-template setup-template-manual build-config reset-template clean

# Default target
help:
	@echo "Universalis Library Template"
	@echo "============================"
	@echo ""
	@echo "Available commands:"
	@echo "  install        - Install dependencies"
	@echo "  dev            - Start development server"
	@echo "  build          - Build static site"
	@echo "  build-content  - Process markdown content with ecosystem tools"
	@echo "  build-pdf      - Generate PDFs only (requires mdtexpdf)"
	@echo "  build-audio    - Generate audiobooks only (requires mdaudiobook)"
	@echo "  build-epub     - Generate ePubs only (requires mdepub)"
	@echo "  build-all      - Generate all formats + build site"
	@echo "  setup-template        - Interactive template customization"
	@echo "  setup-template manual - Create config files for manual editing"
	@echo "  build-config          - Apply configuration changes"
	@echo "  reset-template        - Reset to default template state"
	@echo "  clean          - Clean generated files"
	@echo ""
	@echo "Ecosystem Integration:"
	@echo "  This template uses mdtexpdf, mdaudiobook, and mdepub"
	@echo "  Install with: ucli build mdtexpdf mdaudiobook mdepub"

# Standard web development commands
install:
	npm install

dev: install build-config-if-needed
	npm run dev

build: install
	npm run build

preview: build
	npm run preview

# Content processing with Universalis ecosystem
build-content:
	@echo "🚀 Building content with Universalis ecosystem..."
	./scripts/build-content.sh

build-pdf:
	@echo "📄 Generating PDFs with mdtexpdf..."
	@if command -v mdtexpdf >/dev/null 2>&1; then \
		mkdir -p public/pdfs/category1 public/pdfs/category2 public/pdfs/category3 public/pdfs/category4 public/pdfs/books public/pdfs/articles public/pdfs/guides; \
		find content/ -name "*.md" -type f ! -name "README.md" | while read file; do \
			reldir=$$(dirname "$$file" | sed 's|content/||'); \
			basename=$$(basename "$$file" .md); \
			echo "Converting $$file with metadata"; \
			(cd "$$(dirname "$$file")" && mdtexpdf convert "$$(basename "$$file")" --read-metadata --toc); \
			if [ -f "$$(dirname "$$file")/$$basename.pdf" ]; then \
				mv "$$(dirname "$$file")/$$basename.pdf" "public/pdfs/$$reldir/$$basename.pdf"; \
			fi; \
		done; \
	else \
		echo "❌ mdtexpdf not found. Install with: ucli build mdtexpdf"; \
		exit 1; \
	fi

build-audio:
	@echo "🎵 Generating audiobooks with mdaudiobook..."
	@if command -v mdaudiobook >/dev/null 2>&1; then \
		find content/ -name "*.md" -exec mdaudiobook {} \; ; \
	else \
		echo "❌ mdaudiobook not found. Install with: ucli build mdaudiobook"; \
		exit 1; \
	fi

build-epub:
	@echo "📖 Generating ePubs with mdepub..."
	@if command -v mdepub >/dev/null 2>&1; then \
		find content/ -name "*.md" -exec mdepub {} \; ; \
	else \
		echo "❌ mdepub not found. Install with: ucli build mdepub"; \
		exit 1; \
	fi

build-all: build-content build
	@echo "✅ Complete build finished!"

# Template configuration system
setup-template:
	@echo "🎯 Interactive library setup..."
	@node scripts/setup-template.js

setup-template-manual:
	@echo "📝 Creating configuration files for manual editing..."
	@node scripts/setup-template.js manual

build-config:
	@echo "🔧 Building configuration..."
	@node scripts/build-config.js

build-config-if-needed:
	@if [ -f "library-config/branding.yaml" ]; then \
		echo "🔧 Applying configuration..."; \
		node scripts/build-config.js; \
	else \
		echo "ℹ️  No configuration found, using defaults"; \
	fi

reset-template:
	@echo "🔄 Resetting template to default state..."
	@node scripts/reset-template.js

# Cleanup
clean:
	@echo "🧹 Cleaning generated files..."
	rm -rf dist/
	rm -rf public/pdfs/
	rm -rf public/audio/
	rm -rf public/epub/
	rm -rf node_modules/.astro/
	@echo "✅ Clean complete!"

# UCLI integration (for ucli build library)
build-system: install build-all
	@echo "✅ Library template ready for deployment!"