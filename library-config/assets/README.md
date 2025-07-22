# Assets Directory

Place your custom assets in this directory:

- **logo.png** - Your library logo (recommended size: 400x100px)
- **favicon.ico** - Your favicon (will be auto-generated if not provided)
- **social-preview.png** - Social media preview image (1200x630px)
- **custom-fonts/** - Any custom font files

## How Logo Processing Works

1. **Setup**: When you run `make setup-template`, your logo is saved here as `logo.png`
2. **Build**: When you run `make build-config`, the system:
   - Copies your logo from `library-config/assets/logo.png` to `public/images/logo.png`
   - Updates all template references to use your logo instead of the template logo
   - Generates favicon and other sizes automatically

**Important**: The source of truth for your logo is `library-config/assets/logo.png`. The copy in `public/images/logo.png` is generated during the build process and should not be edited directly.

The build system will automatically optimize and process these assets.
