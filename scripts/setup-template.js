#!/usr/bin/env node

/**
 * Interactive Template Setup
 * Guides users through customizing their digital library
 * Part of Phase 2: Interactive Setup System with Handlebars-style configuration
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import yaml from 'js-yaml';
import TemplateProcessor from './template-processor.js';
import { validateConfig, applyTheme, themePresets, defaultConfig } from './config-schema.js';

class TemplateSetup {
  constructor() {
    this.configDir = path.join(process.cwd(), 'library-config');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async setup() {
    console.log('\n🚀 Welcome to the Universalis Library Template Setup!\n');
    console.log('This interactive setup will help you customize your digital library.');
    console.log('Using Handlebars-style configuration for maximum flexibility.');
    console.log('You can always edit the configuration files later in the library-config/ directory.\n');

    try {
      const config = await this.gatherConfiguration();
      
      // Validate configuration
      console.log('\n🔍 Validating configuration...');
      validateConfig(config);
      console.log('✅ Configuration is valid!');
      
      await this.writeConfiguration(config);
      await this.copyAssets();
      
      // Process templates with new configuration
      console.log('\n🎨 Processing templates with your configuration...');
      const processor = new TemplateProcessor();
      await processor.processAllTemplates();
      
      console.log('\n✅ Template setup complete!');
      console.log('\n🎉 Your digital library has been fully customized with:');
      console.log(`  📚 Library: ${config.branding.library.name}`);
      console.log(`  👤 Author: ${config.branding.library.author} (${config.branding.library.title})`);
      if (config.branding.library.organization && config.branding.library.organization !== config.branding.library.author) {
        console.log(`  🏢 Organization: ${config.branding.library.organization}`);
      }
      console.log(`  🎨 Theme: ${config.branding.theme}`);
      console.log(`  🌐 Website: ${config.branding.library.website}`);
      if (config.branding.library.email) {
        console.log(`  📧 Contact: ${config.branding.library.email}`);
      }
      if (config.branding.social && (config.branding.social.x || config.branding.social.github || config.branding.social.linkedin)) {
        console.log('  🔗 Social Media: Configured');
      }
      console.log(`  📄 Content License: ${config.branding.content.default_license}`);
      if (config.deployment.analytics && config.deployment.analytics.google_analytics) {
        console.log('  📊 Analytics: Google Analytics enabled');
      }
      if (config.branding.privacy.gdpr_compliant) {
        console.log('  🔒 Privacy: GDPR compliant');
      }
      console.log('\n🚀 Next steps:');
      console.log('  1. Add your content to the content/ directory');
      console.log('  2. Update library-config/library-structure.md with your content');
      console.log('  3. Run "make build-all" to generate PDFs from your markdown');
      console.log('  4. Run "make dev" to preview your library locally');
      console.log('  5. Deploy with "git add . && git commit && git push"');
      console.log('\n📁 Configuration files created:');
      console.log('  - branding.yaml (complete branding, social, content settings)');
      console.log('  - deployment.yaml (domain, SEO, analytics, privacy)');
      console.log('  - library-structure.md (content organization)');
      console.log('  - pages/ directory (about, contact, privacy, terms)');
      console.log('\n✨ Phase 2 Complete: Your library now includes:');
      console.log('  • Professional branding and theming');
      console.log('  • Social media integration');
      console.log('  • Content licensing and metadata');
      console.log('  • Advanced navigation and search');
      console.log('  • Privacy and GDPR compliance options');
      console.log('  • SEO optimization and analytics');
      console.log('\nHappy publishing! 📚 Welcome to the Universalis ecosystem!');
      console.log('\n💡 Tip: You can re-run "make setup-template" anytime to modify your configuration.');
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async gatherConfiguration() {
    let config = {
      branding: {
        library: {},
        colors: {},
        typography: {},
        logo: {},
        navigation: {},
        footer: {}
      },
      deployment: {
        seo: {},
        social: {},
        analytics: {},
        github_pages: {},
        build: {},
        performance: {},
        security: {}
      }
    };

    console.log('📚 Library Information');
    console.log('='.repeat(50));
    
    config.branding.library.name = await this.ask('Library name', '[Your Library Name]');
    config.branding.library.tagline = await this.ask('Library tagline', 'Knowledge at your fingertips');
    config.branding.library.description = await this.ask('Library description', 'A curated collection of thoughts, research, and insights');
    config.branding.library.author = await this.ask('Your name', '[Your Name]');
    config.branding.library.organization = await this.ask('Organization (optional)', config.branding.library.author);
    let website = await this.ask('Your website', 'https://yourwebsite.com');
    // Auto-prepend https:// if no protocol specified
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website;
    }
    config.branding.library.website = website;
    
    // Author details
    config.branding.library.email = await this.ask('Contact email (optional)', '');
    config.branding.library.bio = await this.ask('Author bio (optional)', 'Knowledge creator and digital library curator');
    config.branding.library.title = await this.ask('Professional title (optional)', 'Author');
    config.branding.library.location = await this.ask('Location (optional)', '');
    
    console.log('\n🔗 Social Media & Contact');
    console.log('='.repeat(50));
    
    const addSocial = await this.askYesNo('Add social media links?', false);
    if (addSocial) {
      config.branding.social = {
        x: await this.ask('X (Twitter) username (without @)', ''),
        linkedin: await this.ask('LinkedIn profile URL', ''),
        github: await this.ask('GitHub username', ''),
        mastodon: await this.ask('Mastodon handle (optional)', ''),
        youtube: await this.ask('YouTube channel URL (optional)', ''),
        rss: await this.askYesNo('Enable RSS feed?', true)
      };
    } else {
      config.branding.social = { rss: true };
    }
    
    console.log('\n📝 Content & Publishing');
    console.log('='.repeat(50));
    
    const licenses = ['CC BY 4.0', 'CC BY-SA 4.0', 'CC BY-NC 4.0', 'All Rights Reserved', 'MIT', 'Custom'];
    console.log('Available content licenses:');
    licenses.forEach((license, index) => {
      console.log(`  ${index + 1}. ${license}`);
    });
    
    const licenseChoice = await this.ask('Default content license (1-6)', '1');
    const licenseIndex = parseInt(licenseChoice) - 1;
    config.branding.content = {
      default_license: licenses[licenseIndex] || 'CC BY 4.0',
      show_license: await this.askYesNo('Show license on each page?', true),
      show_dates: await this.askYesNo('Show publication dates?', true),
      enable_comments: await this.askYesNo('Enable comments (via GitHub Discussions)?', false)
    };
    
    if (config.branding.content.default_license === 'Custom') {
      config.branding.content.custom_license_text = await this.ask('Custom license text', 'All rights reserved');
      config.branding.content.custom_license_url = await this.ask('Custom license URL (optional)', '');
    }

    console.log('\n🎨 Visual Design');
    console.log('='.repeat(50));
    
    const themes = ['blue-professional', 'green-academic', 'purple-creative', 'orange-warm', 'gray-minimal'];
    console.log('Available themes:');
    themes.forEach((theme, index) => {
      const preset = themePresets[theme];
      console.log(`  ${index + 1}. ${theme} (Primary: ${preset.colors.primary})`);
    });
    
    const themeChoice = await this.ask('Choose a theme (1-5)', '1');
    const themeIndex = parseInt(themeChoice) - 1;
    const selectedTheme = themes[themeIndex] || 'blue-professional';
    
    // Apply theme preset
    config = applyTheme(config, selectedTheme);
    console.log(`✅ Applied ${selectedTheme} theme`);

    const customColors = await this.askYesNo('Do you want to customize colors?', false);
    if (customColors) {
      console.log(`\nCurrent theme colors:`);
      console.log(`  Primary: ${config.branding.colors.primary}`);
      console.log(`  Secondary: ${config.branding.colors.secondary}`);
      console.log(`  Accent: ${config.branding.colors.accent}`);
      console.log('');
      
      config.branding.colors.primary = await this.ask('Primary color (hex)', config.branding.colors.primary);
      config.branding.colors.secondary = await this.ask('Secondary color (hex)', config.branding.colors.secondary);
      config.branding.colors.accent = await this.ask('Accent color (hex)', config.branding.colors.accent);
      config.branding.colors.background = await this.ask('Background color (hex)', config.branding.colors.background);
      config.branding.colors.text = await this.ask('Text color (hex)', config.branding.colors.text);
    }

    console.log('\n🔤 Typography');
    console.log('='.repeat(50));
    
    const fonts = [
      'Inter, system-ui, sans-serif',
      'Roboto, system-ui, sans-serif', 
      'Open Sans, system-ui, sans-serif',
      'Lato, system-ui, sans-serif',
      'Source Sans Pro, system-ui, sans-serif'
    ];
    
    console.log('Available font families:');
    fonts.forEach((font, index) => {
      console.log(`  ${index + 1}. ${font.split(',')[0]}`);
    });
    
    const fontChoice = await this.ask('Choose a font (1-5)', '1');
    const fontIndex = parseInt(fontChoice) - 1;
    config.branding.typography.primary_font = fonts[fontIndex] || fonts[0];
    config.branding.typography.heading_font = config.branding.typography.primary_font;

    console.log('\n🖼️  Logo Setup (Optional)');
    console.log('='.repeat(50));
    
    const addLogo = await this.askYesNo('Do you want to add a logo?', false);
    if (addLogo) {
      await this.handleLogoSetup();
    }

    console.log('\n🌐 Website Settings');
    console.log('='.repeat(50));
    
    config.deployment.domain = await this.ask('Custom domain (optional)', 'yourlibrary.com');
    config.deployment.base_url = `https://${config.deployment.domain}`;
    
    config.deployment.seo.meta_description = await this.ask('SEO description', `${config.branding.library.description}`);
    config.deployment.seo.keywords = await this.ask('SEO keywords (comma-separated)', 'digital library, knowledge, research');
    
    console.log('\n📊 Analytics (Optional)');
    console.log('='.repeat(50));
    
    const enableAnalytics = await this.askYesNo('Enable Google Analytics?', false);
    if (enableAnalytics) {
      config.deployment.analytics.google_analytics = await this.ask('Google Analytics ID (G-XXXXXXXXXX)', '');
    }

    console.log('\n⚙️  Advanced Customization');
    console.log('='.repeat(50));
    
    // Footer customization
    config.branding.footer = {
      show_copyright: await this.askYesNo('Show copyright notice in footer?', true),
      show_powered_by: await this.askYesNo('Show "Powered by Universalis" credit?', true),
      custom_text: await this.ask('Custom footer text (optional)', ''),
      show_social_links: await this.askYesNo('Show social media links in footer?', true)
    };
    
    // Navigation preferences
    config.branding.navigation = {
      show_search: await this.askYesNo('Enable search functionality?', true),
      show_breadcrumbs: await this.askYesNo('Show breadcrumb navigation?', true),
      sticky_header: await this.askYesNo('Use sticky header?', true),
      show_progress: await this.askYesNo('Show reading progress indicator?', true)
    };
    
    // Privacy and legal
    console.log('\n🔒 Privacy & Legal');
    console.log('='.repeat(50));
    
    config.branding.privacy = {
      cookie_consent: await this.askYesNo('Enable cookie consent banner?', false),
      privacy_policy: await this.askYesNo('Include privacy policy page?', true),
      terms_of_service: await this.askYesNo('Include terms of service page?', false),
      gdpr_compliant: await this.askYesNo('Enable GDPR compliance features?', false)
    };
    
    if (config.branding.privacy.gdpr_compliant) {
      config.branding.privacy.data_retention_days = await this.ask('Data retention period (days)', '365');
      config.branding.privacy.contact_dpo = await this.ask('Data Protection Officer email (optional)', config.branding.library.email);
    }
    
    console.log('\n🚀 Deployment');
    console.log('='.repeat(50));
    
    config.deployment.github_pages.enabled = await this.askYesNo('Deploy to GitHub Pages?', true);
    if (config.deployment.github_pages.enabled) {
      config.deployment.github_pages.cname = await this.askYesNo('Use custom domain?', false);
      config.deployment.subdomain = await this.ask('GitHub Pages subdomain', 'my-library');
    }

    return config;
  }

  async ask(question, defaultValue = '') {
    return new Promise((resolve) => {
      const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  async askYesNo(question, defaultValue = false) {
    const defaultText = defaultValue ? 'Y/n' : 'y/N';
    const answer = await this.ask(`${question} (${defaultText})`, defaultValue ? 'y' : 'n');
    return answer.toLowerCase().startsWith('y');
  }

  async handleLogoSetup() {
    console.log('\nSupported formats: PNG, JPG, JPEG');
    console.log('Recommended size: 400x100px or similar aspect ratio\n');
    
    const logoPath = await this.ask('Path to your logo image', '');
    
    if (!logoPath) {
      console.log('⏭️  Skipping logo setup');
      return;
    }
    
    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      console.log(`❌ Error: File not found at ${logoPath}`);
      const retry = await this.askYesNo('Would you like to try a different path?', true);
      if (retry) {
        return await this.handleLogoSetup();
      }
      return;
    }
    
    // Check file extension
    const ext = path.extname(logoPath).toLowerCase();
    const supportedFormats = ['.png', '.jpg', '.jpeg'];
    
    if (!supportedFormats.includes(ext)) {
      console.log(`❌ Error: Unsupported format ${ext}`);
      console.log('Supported formats: PNG, JPG, JPEG');
      const retry = await this.askYesNo('Would you like to try a different file?', true);
      if (retry) {
        return await this.handleLogoSetup();
      }
      return;
    }
    
    try {
      // Ensure assets directory exists
      const assetsDir = path.join(this.configDir, 'assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      const targetPath = path.join(assetsDir, 'logo.png');
      
      // If it's already a PNG, just copy it
      if (ext === '.png') {
        fs.copyFileSync(logoPath, targetPath);
        console.log('✅ Logo copied successfully!');
      } else {
        // For JPG/JPEG, we'll copy it but warn about format
        const jpegTargetPath = path.join(assetsDir, `logo${ext}`);
        fs.copyFileSync(logoPath, jpegTargetPath);
        
        // Also copy to logo.png for compatibility
        fs.copyFileSync(logoPath, targetPath);
        
        console.log(`✅ Logo copied successfully!`);
        console.log(`📝 Note: Your ${ext.toUpperCase()} file has been copied as logo.png`);
        console.log('   For best results, consider using a PNG file in the future.');
      }
      
      console.log('\n🎯 Logo setup complete!');
      console.log('   The system will automatically generate:');
      console.log('   - favicon.ico');
      console.log('   - apple-touch-icon.png');
      console.log('   - social preview images');
      console.log('   - Multiple sizes for different uses');
      
    } catch (error) {
      console.log(`❌ Error copying logo: ${error.message}`);
      const retry = await this.askYesNo('Would you like to try again?', true);
      if (retry) {
        return await this.handleLogoSetup();
      }
    }
  }

  async writeConfiguration(config) {
    console.log('\n💾 Writing configuration files...');
    
    // Ensure config directory exists
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    // Write branding.yaml
    const brandingPath = path.join(this.configDir, 'branding.yaml');
    const brandingYaml = yaml.dump(config.branding, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true 
    });
    
    const brandingContent = `# Branding Configuration for Your Digital Library
# Generated by interactive setup - you can edit these values anytime

${brandingYaml}`;
    
    fs.writeFileSync(brandingPath, brandingContent);
    console.log('✅ Created branding.yaml');

    // Write deployment.yaml
    const deploymentPath = path.join(this.configDir, 'deployment.yaml');
    const deploymentYaml = yaml.dump(config.deployment, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true 
    });
    
    const deploymentContent = `# Deployment Configuration for Your Digital Library
# Generated by interactive setup - you can edit these values anytime

${deploymentYaml}`;
    
    fs.writeFileSync(deploymentPath, deploymentContent);
    console.log('✅ Created deployment.yaml');
  }

  async copyAssets() {
    console.log('\n📁 Setting up assets directory...');
    
    const assetsDir = path.join(this.configDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Check if logo was already set up during interactive setup
    const logoPath = path.join(assetsDir, 'logo.png');
    if (!fs.existsSync(logoPath)) {
      // Copy existing template logo if available
      const templateLogo = path.join(process.cwd(), 'public', 'images', 'template-logo.png');
      if (fs.existsSync(templateLogo)) {
        fs.copyFileSync(templateLogo, logoPath);
        console.log('✅ Copied template logo to assets/logo.png');
      } else {
        console.log('ℹ️  No logo set up - you can add one later to library-config/assets/logo.png');
      }
    } else {
      console.log('✅ Logo already configured');
    }

    const readmePath = path.join(assetsDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
      const readmeContent = `# Assets Directory

Place your custom assets in this directory:

- **logo.png** - Your library logo (recommended size: 400x100px)
- **favicon.ico** - Your favicon (will be auto-generated if not provided)
- **social-preview.png** - Social media preview image (1200x630px)
- **custom-fonts/** - Any custom font files

The build system will automatically optimize and process these assets.
`;
      fs.writeFileSync(readmePath, readmeContent);
      console.log('✅ Created assets README');
    }
  }
}

// Command line argument handling
const args = process.argv.slice(2);
const isManual = args.includes('manual');

if (isManual) {
  console.log('\n📝 Manual Setup Mode');
  console.log('='.repeat(50));
  console.log('Configuration files have been created in library-config/');
  console.log('Edit the following files to customize your library:');
  console.log('- library-config/branding.yaml');
  console.log('- library-config/deployment.yaml');
  console.log('- library-config/library-structure.md');
  console.log('- library-config/pages/*.md');
  console.log('\nRun "make build-config" when you\'re ready to apply changes.');
} else {
  // Run interactive setup
  const setup = new TemplateSetup();
  setup.setup().catch(console.error);
}

export default TemplateSetup;
