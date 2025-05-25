# Guide to Customizing Your Astro Digital Library Template

Welcome! This guide will help you transform this generic Astro Digital Library template into your own personalized digital library.

## Prerequisites

*   **Node.js and npm/yarn**: Ensure you have a recent version of Node.js installed, which includes npm. Yarn is also a popular alternative.

## Customization Steps

Follow these steps to tailor the template to your needs:

1.  **Project Configuration (`package.json`):**
    *   Open `package.json` in the root directory.
    *   Change the `"name"` field to your project's name (e.g., `"my-awesome-library"`).
    *   Update the `"description"` field.
    *   Consider adding an `"author"` field with your details.

2.  **Site-wide Information & Branding:**
    *   **Logo & Favicon**: **Crucially, you MUST replace `public/images/logo.png` with your own logo image.** This single file is used for both the website logo (e.g., in the Navbar) and the browser tab icon. The template includes a placeholder at this location.
    *   **CNAME**: If you have a custom domain, update the `CNAME` file in the root directory with your domain name (e.g., `mylibrary.example.com`). If you don't plan to use GitHub Pages with a custom domain, you can remove this file.

3.  **Content Pages (`src/pages/`):
    *   Go through each `.astro` file in `src/pages/` (e.g., `index.astro`, `about.astro`, `contact.astro`).
    *   Look for placeholder text like `[Your Website Name]`, `[Your Company/Organization Name]`, `[Your Library Name]`, `contact@yourdomain.com`, etc., and replace it with your specific information.
    *   Update titles in the `<Layout title="...">` component on each page.

4.  **Social Media Links (`src/pages/social.astro`):
    *   Open `src/pages/social.astro`.
    *   Update the `socialLinks` array with your actual social media profile URLs. Remove any platforms you don't use or add new ones.
    *   Remove the parenthetical note in the paragraph after updating the links.

5.  **Library Collection Data (`src/data/books.json`):
    *   Edit `src/data/books.json`.
    *   Replace the example book entries with your actual digital collection. Ensure the `slug` for each item is unique and that PDF files (or other document types) are correctly placed in the `public/pdfs/` directory (or your chosen directory, updating paths accordingly).
    *   Update author names and summaries.

6.  **Legal Documents (CRITICAL):**
    *   **`LICENSE`**: This template uses the Apache License 2.0. You can generally use this as is, but you may want to update copyright year and owner name if you make significant modifications to the template code itself (not just content).
    *   **`src/pages/privacy-policy.astro`**: Review and customize this page thoroughly. The provided text is a generic template. **You MUST consult with a legal professional** to ensure it accurately reflects your data handling practices and complies with all applicable laws and regulations for your users.
    *   **`src/pages/terms-conditions.astro`**: Similar to the privacy policy, this is a generic template. **You MUST consult with a legal professional** to tailor it to your specific services, content policies, and legal requirements.

7.  **Styling (Optional):
    *   Modify CSS styles in `.astro` files (within `<style>` tags) or in global stylesheets (e.g., `src/styles/global.css` if you create one) to match your desired look and feel.

## Running the Development Server

To see your changes live as you edit:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will usually start a server at `http://localhost:4321`.

## Building for Production

When you're ready to deploy:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will create a `dist/` folder with the static files for your site.

## Deployment

Astro sites can be deployed to various static hosting providers like:

*   Netlify
*   Vercel
*   GitHub Pages
*   Cloudflare Pages

Consult the Astro documentation and your chosen provider's documentation for specific deployment instructions.

## Helper Script for Customization

To make customization easier, a helper script is provided at `scripts/setup_template.js`. This script can prompt you for common values (like library name, contact email, etc.) and update many of the template files automatically. Run it from the root of your project using `node scripts/setup_template.js` and follow the prompts. It's recommended to run this script early in your customization process.

Happy library building!
