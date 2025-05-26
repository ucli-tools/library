.DEFAULT_GOAL := help

.PHONY: help all clean preview deploy lint format test doctor serve FORCE

# Default target: Display help message
help: 
	@echo ""
	@echo "---------------------------------------------------------------------"
	@echo "  🚀 Welcome to the Astro Digital Library Template! 🚀"
	@echo "---------------------------------------------------------------------"
	@echo ""
	@echo "  This template (from github.com/ucli-tools/library) helps you"
	@echo "  quickly set up a beautiful and functional digital library website."
	@echo ""
	@echo "  Getting Started:"
	@echo "  ----------------"
	@echo "  1. Personalize Your Library:"
	@echo "     Run the interactive setup script to update project details:"
	@echo "     \033[1m\033[36mnode scripts/setup_template.js\033[0m"
	@echo ""
	@echo "  2. Install Dependencies:"
	@echo "     \033[1m\033[36mnpm install\033[0m (or yarn install / pnpm install)"
	@echo ""
	@echo "  3. Start the Development Server:"
	@echo "     \033[1m\033[36mnpm run dev\033[0m"
	@echo "     Your site will typically be available at http://localhost:4321"
	@echo ""
	@echo "  4. Explore the Documentation:"
	@echo "     - Detailed Customization Guide: \033[4mdocs/template_update.md\033[0m"
	@echo "     - Deployment Instructions:      \033[4mdocs/deploy.md\033[0m"
	@echo "     - Project Overview:             \033[4mREADME.md\033[0m"
	@echo ""
	@echo "  Available \`make\` commands:"
	@echo "  --------------------------"
	@echo "  make help         : Show this help message."
	@echo "  make setup        : Run the interactive template setup script."
	@echo "  make install      : Install project dependencies."
	@echo "  make dev          : Start the development server."
	@echo "  make build        : Build the project for production."
	@echo "  make preview      : Preview the production build locally."
	@echo "  make serve        : Serve the 'dist' folder (static build) locally."
	@echo "  make deploy       : Run the deployment script (e.g., for GitHub Pages)."
	@echo "  make lint         : Run the linter to check code quality."
	@echo "  make format       : Run the code formatter."
	@echo "  make test         : Run automated tests."
	@echo "  make doctor       : Run Astro's diagnostic tool (astro check)."
	@echo "  make clean        : Remove 'node_modules' and 'dist' directories."
	@echo ""
	@echo "  Happy library building!"
	@echo "---------------------------------------------------------------------"
	@echo ""

# The 'all' target (previously aliased to 'help') has been removed
# as 'help' is already the default goal.

# You can add other common project commands here if desired:
# For example:
install:
	@echo "Installing dependencies..."
	@npm install

dev:
	@echo "Starting development server..."
	@npm run dev

build:
	@echo "Building for production..."
	@npm run build

setup:
	@echo "Running template setup script..."
	@node scripts/setup_template.js

clean:
	@echo "Cleaning project..."
	@echo "Removing node_modules directory..."
	@rm -rf node_modules
	@echo "Removing dist directory..."
	@rm -rf dist
	@echo "Removing .astro directory..."
	@rm -rf .astro
	@echo "Project cleaned."

preview:
	@echo "Previewing production build..."
	@npm run preview

deploy:
	@echo "Running deployment script (npm run deploy)..."
	@npm run deploy

lint:
	@echo "Running linter (npm run lint)..."
	@npm run lint

format:
	@echo "Running code formatter (npm run format)..."
	@npm run format

test:
	@echo "Running tests (npm run test)..."
	@npm run test

doctor:
	@echo "Running Astro diagnostics (npm run astro check)..."
	@npm run astro check

serve:
	@echo "Serving the 'dist' directory (production build)..."
	@echo "Make sure you have run 'make build' first."
	@echo "Access at http://localhost:4321 (usually, or check http-server output)"
	@npx http-server ./dist -o
