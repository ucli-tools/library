#!/usr/bin/env node

/**
 * Template Reset Script
 * Restores the library template to its original pristine state
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class TemplateReset {
  constructor() {
    this.projectRoot = process.cwd();
    this.configDir = path.join(this.projectRoot, 'library-config');
    this.srcDir = path.join(this.projectRoot, 'src');
  }

  async reset() {
    console.log('\n🔄 Resetting library template to default state...\n');
    
    try {
      // Confirm with user
      const confirmed = await this.confirmReset();
      if (!confirmed) {
        console.log('❌ Reset cancelled by user.');
        return;
      }

      // Step 1: Remove customization
      await this.removeCustomization();
      
      // Step 2: Clean generated files
      await this.cleanGeneratedFiles();
      
      // Step 3: Restore default configuration
      await this.restoreDefaultConfig();
      
      // Step 4: Rebuild with defaults
      await this.rebuildDefaults();
      
      console.log('\n✅ Template reset complete!');
      console.log('\nYour library has been restored to the original template state.');
      console.log('You can now run "make dev" to see the default example library.');
      console.log('To customize again, run "make setup-template" or edit files in library-config/\n');
      
    } catch (error) {
      console.error('\n❌ Reset failed:', error.message);
      process.exit(1);
    }
  }

  async confirmReset() {
    return new Promise((resolve) => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      console.log('⚠️  WARNING: This will permanently delete all your customizations!');
      console.log('   - All files in library-config/ will be removed');
      console.log('   - Generated pages and styles will be reset');
      console.log('   - Your content in content/ directory will be preserved');
      console.log('   - This action cannot be undone\n');
      
      rl.question('Are you sure you want to reset to the default template? (y/N): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes');
      });
    });
  }

  async removeCustomization() {
    console.log('🗑️  Removing customization files...');
    
    if (fs.existsSync(this.configDir)) {
      fs.rmSync(this.configDir, { recursive: true, force: true });
      console.log('   ✅ Removed library-config/ directory');
    } else {
      console.log('   ℹ️  No library-config/ directory found');
    }
  }

  async cleanGeneratedFiles() {
    console.log('🧹 Cleaning generated files...');
    
    // Remove generated Astro pages
    const generatedPages = [
      'about.astro',
      'contact.astro', 
      'privacy-policy.astro',
      'terms-conditions.astro'
    ];
    
    for (const page of generatedPages) {
      const pagePath = path.join(this.srcDir, 'pages', page);
      if (fs.existsSync(pagePath)) {
        // Check if it's a generated file
        const content = fs.readFileSync(pagePath, 'utf8');
        if (content.includes('// Generated from library-config/')) {
          fs.unlinkSync(pagePath);
          console.log(`   ✅ Removed generated ${page}`);
        }
      }
    }
    
    // Remove generated CSS
    const generatedCSS = path.join(this.srcDir, 'styles', 'config-generated.css');
    if (fs.existsSync(generatedCSS)) {
      fs.unlinkSync(generatedCSS);
      console.log('   ✅ Removed generated CSS');
    }
    
    // Clean Layout.astro import
    const layoutPath = path.join(this.srcDir, 'layouts', 'Layout.astro');
    if (fs.existsSync(layoutPath)) {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');
      if (layoutContent.includes('config-generated.css')) {
        layoutContent = layoutContent.replace(/\nimport '\.\.\/styles\/config-generated\.css';/, '');
        fs.writeFileSync(layoutPath, layoutContent);
        console.log('   ✅ Cleaned Layout.astro imports');
      }
    }
  }

  async restoreDefaultConfig() {
    console.log('🔧 Restoring default configuration...');
    
    // Create config directory
    fs.mkdirSync(this.configDir, { recursive: true });
    
    // Create default branding.yaml
    const defaultBranding = `# Branding Configuration for Your Digital Library
# Edit these values to customize your library's appearance and branding

library:
  name: "[Your Library Name]"
  tagline: "Knowledge at your fingertips"
  description: "A curated collection of thoughts, research, and insights"
  author: "[Your Name]"
  organization: "[Your Organization]"
  website: "https://yourwebsite.com"

# Color scheme - choose a preset theme or customize individual colors
theme: "blue-professional"  # Options: blue-professional, green-academic, purple-creative, orange-warm, gray-minimal

# Override specific colors (optional)
colors:
  # primary: "#2563eb"      # Uncomment to override theme colors
  # secondary: "#64748b"
  # background: "#ffffff"
  # text: "#1e293b"
  # accent: "#f59e0b"

# Typography settings
typography:
  primary_font: "Inter, system-ui, sans-serif"
  heading_font: "Inter, system-ui, sans-serif"
  code_font: "JetBrains Mono, Consolas, monospace"
  font_size_base: "16px"
  line_height: "1.6"

# Logo and visual assets
logo:
  path: "assets/logo.png"           # Path to your logo file
  width: "200px"                    # Logo width in navigation
  height: "auto"                    # Logo height (auto maintains aspect ratio)
  favicon: "assets/favicon.ico"     # Path to favicon (will be auto-generated if not provided)
  social_preview: "assets/social-preview.png"  # Social media preview image

# Navigation settings
navigation:
  show_search: true                 # Enable/disable search functionality
  show_theme_toggle: true           # Enable/disable dark/light mode toggle
  custom_links:                     # Additional navigation links
    - name: "Blog"
      url: "https://yourblog.com"
      external: true
    - name: "Newsletter"
      url: "/newsletter"
      external: false

# Footer settings
footer:
  show_social_links: true
  show_rss: true
  custom_text: "Built with ❤️ using the Universalis Library Template"
`;

    fs.writeFileSync(path.join(this.configDir, 'branding.yaml'), defaultBranding);
    console.log('   ✅ Created default branding.yaml');

    // Create default deployment.yaml
    const defaultDeployment = `# Deployment Configuration for Your Digital Library
# Configure domain, analytics, SEO, and deployment settings

# Domain and URL settings
domain: "yourlibrary.com"                    # Your custom domain (optional)
base_url: "https://yourlibrary.com"          # Full base URL for your library
subdomain: "my-library"                      # GitHub Pages subdomain (username.github.io/subdomain)

# SEO and metadata
seo:
  meta_description: "My personal digital library - a curated collection of knowledge and insights"
  keywords: ["digital library", "knowledge", "research", "books", "articles"]
  author: "[Your Name]"
  language: "en"
  robots: "index, follow"
  
# Social media and sharing
social:
  twitter_handle: "@yourusername"            # Your Twitter handle (optional)
  og_image: "assets/social-preview.png"      # Open Graph image for social sharing
  og_type: "website"
  
# Analytics (optional)
analytics:
  google_analytics: ""                       # Google Analytics measurement ID (G-XXXXXXXXXX)
  google_tag_manager: ""                     # Google Tag Manager ID (GTM-XXXXXXX)
  plausible_domain: ""                       # Plausible analytics domain
  umami_website_id: ""                       # Umami analytics website ID
  
# GitHub Pages deployment
github_pages:
  enabled: true                              # Enable GitHub Pages deployment
  branch: "gh-pages"                         # Deployment branch
  cname: true                                # Create CNAME file for custom domain
  
# Build and deployment settings
build:
  output_dir: "dist"                         # Build output directory
  base_path: "/"                             # Base path for URLs (use "/subdirectory/" if deployed in subdirectory)
  
# Performance and optimization
performance:
  minify_html: true                          # Minify HTML output
  minify_css: true                           # Minify CSS output
  minify_js: true                            # Minify JavaScript output
  optimize_images: true                      # Optimize image assets
  
# Security headers (for advanced users)
security:
  content_security_policy: false            # Enable CSP headers
  x_frame_options: "SAMEORIGIN"             # X-Frame-Options header
  x_content_type_options: "nosniff"         # X-Content-Type-Options header
`;

    fs.writeFileSync(path.join(this.configDir, 'deployment.yaml'), defaultDeployment);
    console.log('   ✅ Created default deployment.yaml');

    // Create default library-structure.md
    const defaultStructure = `# Library Structure

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
\`\`\`markdown
- [Books](books)
- [Articles](articles)
- [Research](research)
- [Resources](resources)
\`\`\`

### Add New Content
Add new content by referencing the markdown file:
\`\`\`markdown
- [Books](books)
  - [My First Book](books/my-first-book.md)
  - [Another Book](books/another-book.md)
\`\`\`

### Reorganize Structure
You can create subcategories and reorganize as needed:
\`\`\`markdown
- [Fiction](fiction)
  - [Novels](fiction/novels)
    - [My Novel](fiction/novels/my-novel.md)
  - [Short Stories](fiction/stories)
    - [Story Collection](fiction/stories/collection.md)
\`\`\`

### Notes
- The build system will automatically detect corresponding PDF files
- Category slugs (the part in parentheses) become URL paths
- Content files should exist in the \`content/\` directory
- PDFs should exist in the \`public/pdfs/\` directory with matching paths
`;

    fs.writeFileSync(path.join(this.configDir, 'library-structure.md'), defaultStructure);
    console.log('   ✅ Created default library-structure.md');

    // Create pages directory with default pages
    const pagesDir = path.join(this.configDir, 'pages');
    fs.mkdirSync(pagesDir, { recursive: true });

    // Create default static pages
    const defaultPages = {
      'about.md': `# About This Library

Welcome to my digital library! This is a curated collection of my thoughts, research, and insights on topics that matter to me.

## My Mission

I believe that knowledge grows when shared. This library represents my commitment to making valuable information accessible and building a community around learning and discovery.

## What You'll Find Here

- **In-depth research** on topics I'm passionate about
- **Practical guides** based on real-world experience
- **Thoughtful analysis** of complex subjects
- **Resources and references** to help you dive deeper

## About Me

[Write a brief bio about yourself here. Include your background, expertise, and what drives your passion for knowledge sharing.]

I'm passionate about [your interests/expertise areas]. When I'm not researching and writing, you can find me [personal interests/hobbies].

## How This Library Works

This digital library is built using the Universalis ecosystem, which allows me to:

- Write content in simple markdown format
- Generate professional PDFs automatically
- Create audiobook versions of my content
- Maintain a beautiful, searchable web interface

## Get in Touch

I'd love to hear from you! Whether you have questions, suggestions, or just want to connect, feel free to [reach out](/contact/).

## Support This Work

If you find value in this library, consider:

- Sharing content that resonates with you
- Providing feedback and suggestions
- [Supporting my work](https://yourwebsite.com/support) (if applicable)

---

*This library is continuously growing. Check back regularly for new content and updates!*`,

      'contact.md': `# Contact Me

I'd love to hear from you! Whether you have questions about my work, suggestions for new content, or just want to connect, there are several ways to reach me.

## Get in Touch

### Email
The best way to reach me is via email: **[your.email@example.com](mailto:your.email@example.com)**

I try to respond to all emails within 48 hours. Please be patient if you don't hear back immediately!

### Social Media
Connect with me on social platforms:

- **Twitter/X**: [@yourusername](https://twitter.com/yourusername)
- **LinkedIn**: [Your Name](https://linkedin.com/in/yourprofile)
- **Mastodon**: [@yourusername@mastodon.social](https://mastodon.social/@yourusername)

### Website
Visit my main website: **[yourwebsite.com](https://yourwebsite.com)**

## What to Expect

When you reach out, here's what you can expect:

- **Questions about content**: I'm happy to clarify or expand on anything in my library
- **Collaboration opportunities**: Always interested in connecting with like-minded individuals
- **Feedback and suggestions**: Your input helps me improve and create better content
- **Speaking engagements**: Available for talks, workshops, and interviews

## Response Times

- **Email**: Within 48 hours
- **Social media**: Within 24 hours for direct messages
- **Comments**: I check and respond regularly

## Topics I Love Discussing

- [List your areas of expertise/interest]
- [Research methodologies]
- [Knowledge sharing and digital libraries]
- [Any specific topics related to your content]

## Not Sure What to Say?

Here are some conversation starters:

- "I really enjoyed your piece on [topic]. Have you considered exploring [related topic]?"
- "I'm working on [project] and would love your perspective on [specific aspect]"
- "What resources would you recommend for someone just starting with [topic]?"

---

*Looking forward to connecting with you!*`,

      'privacy.md': `# Privacy Policy

*Last updated: [Month] [Day], [Year]*

This privacy policy describes how [Your Library Name] ("we", "our", or "us") collects, uses, and protects your information when you visit our digital library.

## Information We Collect

### Automatically Collected Information
When you visit our library, we may automatically collect certain information about your device, including:

- Browser type and version
- Operating system
- IP address (anonymized)
- Pages visited and time spent
- Referring website

### Analytics
We use privacy-focused analytics to understand how visitors use our library. This helps us improve the content and user experience. We may use:

- **Google Analytics** (if enabled): Anonymized data collection
- **Plausible Analytics** (if enabled): Privacy-focused, GDPR-compliant analytics
- **Self-hosted analytics** (if enabled): Data stays on our servers

### Cookies
Our website may use cookies to:

- Remember your theme preference (light/dark mode)
- Improve site performance
- Provide analytics (if you consent)

You can disable cookies in your browser settings, though some features may not work properly.

## How We Use Your Information

We use the collected information to:

- Improve our library content and user experience
- Understand which topics are most valuable to our readers
- Ensure our website functions properly
- Comply with legal obligations

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties, except:

- **Service providers**: Analytics services (Google Analytics, etc.) as configured
- **Legal requirements**: If required by law or to protect our rights

## Data Security

We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

Depending on your location, you may have the right to:

- Access the personal information we have about you
- Request correction of inaccurate information
- Request deletion of your information
- Object to processing of your information
- Request data portability

## Third-Party Links

Our library may contain links to external websites. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies.

## Children's Privacy

Our library is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.

## Contact Us

If you have questions about this privacy policy, please contact us at:

- **Email**: [your.email@example.com](mailto:your.email@example.com)
- **Website**: [yourwebsite.com/contact](https://yourwebsite.com/contact)

---

*This privacy policy template should be customized based on your specific use case and local privacy laws (GDPR, CCPA, etc.). Consider consulting with a legal professional for compliance in your jurisdiction.*`,

      'terms.md': `# Terms and Conditions

*Last updated: [Month] [Day], [Year]*

These terms and conditions ("Terms") govern your use of [Your Library Name] ("the Library", "our library") operated by [Your Name/Organization] ("we", "us", or "our").

## Acceptance of Terms

By accessing and using this library, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily access and view the materials in this digital library for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose or for any public display (commercial or non-commercial)
- Attempt to decompile or reverse engineer any software contained in the library
- Remove any copyright or other proprietary notations from the materials

This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.

## Content and Intellectual Property

### Our Content
The content in this library, including but not limited to text, graphics, images, and other material ("Content") is owned by [Your Name/Organization] and is protected by copyright, trademark, and other laws.

### User-Generated Content
If you submit comments, feedback, or other content to our library, you grant us a non-exclusive, royalty-free, perpetual license to use, modify, and display such content.

### Third-Party Content
Some content may be provided by third parties. We do not endorse or assume responsibility for third-party content.

## Disclaimer

The materials in this library are provided on an 'as is' basis. To the fullest extent permitted by law, this library excludes all representations, warranties, conditions, and terms whether express, implied, or statutory.

## Limitations

In no event shall [Your Name/Organization] or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials in this library.

## Privacy

Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the library.

## Prohibited Uses

You may not use our library:

- For any unlawful purpose or to solicit others to perform unlawful acts
- To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
- To infringe upon or violate our intellectual property rights or the intellectual property rights of others
- To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
- To submit false or misleading information
- To upload or transmit viruses or any other type of malicious code

## Termination

We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

## Governing Law

These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.

## Contact Information

If you have any questions about these Terms and Conditions, please contact us at:

- **Email**: [your.email@example.com](mailto:your.email@example.com)
- **Website**: [yourwebsite.com/contact](https://yourwebsite.com/contact)

---

*This terms and conditions template should be customized based on your specific use case and local laws. Consider consulting with a legal professional to ensure compliance in your jurisdiction.*`
    };

    for (const [filename, content] of Object.entries(defaultPages)) {
      fs.writeFileSync(path.join(pagesDir, filename), content);
      console.log(`   ✅ Created default ${filename}`);
    }

    // Create assets directory
    const assetsDir = path.join(this.configDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    
    const assetsReadme = `# Assets Directory

Place your custom assets in this directory:

- **logo.png** - Your library logo (recommended size: 400x100px)
- **favicon.ico** - Your favicon (will be auto-generated if not provided)
- **social-preview.png** - Social media preview image (1200x630px)
- **custom-fonts/** - Any custom font files

The build system will automatically optimize and process these assets.
`;
    fs.writeFileSync(path.join(assetsDir, 'README.md'), assetsReadme);
    console.log('   ✅ Created assets directory with README');
  }

  async rebuildDefaults() {
    console.log('🔨 Rebuilding with default configuration...');
    
    try {
      // Run the build-config script to apply defaults
      execSync('node scripts/build-config.js', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      console.log('   ✅ Configuration rebuilt successfully');
    } catch (error) {
      console.error('   ❌ Failed to rebuild configuration:', error.message);
      throw error;
    }
  }
}

// Run the reset
const reset = new TemplateReset();
reset.reset().catch(console.error);

export default TemplateReset;
