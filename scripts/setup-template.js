#!/usr/bin/env node

/**
 * Interactive Template Setup
 * Guides users through customizing their digital library
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import yaml from 'js-yaml';

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
    console.log('You can always edit the configuration files later in the library-config/ directory.\n');

    try {
      const config = await this.gatherConfiguration();
      await this.writeConfiguration(config);
      await this.copyAssets();
      
      console.log('\n✅ Template setup complete!');
      console.log('\nNext steps:');
      console.log('1. Add your logo to library-config/assets/logo.png');
      console.log('2. Edit your content in the content/ directory');
      console.log('3. Customize static pages in library-config/pages/');
      console.log('4. Run "make build-config" to apply your changes');
      console.log('5. Run "make dev" to preview your library');
      console.log('\nHappy publishing! 📚');
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async gatherConfiguration() {
    const config = {
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
    config.branding.library.website = await this.ask('Your website', 'https://yourwebsite.com');

    console.log('\n🎨 Visual Design');
    console.log('='.repeat(50));
    
    const themes = ['blue-professional', 'green-academic', 'purple-creative', 'orange-warm', 'gray-minimal'];
    console.log('Available themes:');
    themes.forEach((theme, index) => {
      console.log(`  ${index + 1}. ${theme}`);
    });
    
    const themeChoice = await this.ask('Choose a theme (1-5)', '1');
    const themeIndex = parseInt(themeChoice) - 1;
    config.branding.theme = themes[themeIndex] || 'blue-professional';

    const customColors = await this.askYesNo('Do you want to customize colors?', false);
    if (customColors) {
      config.branding.colors.primary = await this.ask('Primary color (hex)', '#2563eb');
      config.branding.colors.secondary = await this.ask('Secondary color (hex)', '#64748b');
      config.branding.colors.accent = await this.ask('Accent color (hex)', '#f59e0b');
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

    // Create placeholder files
    const placeholderLogo = path.join(assetsDir, 'logo.png');
    if (!fs.existsSync(placeholderLogo)) {
      // Copy existing template logo if available
      const templateLogo = path.join(process.cwd(), 'public', 'images', 'template-logo.png');
      if (fs.existsSync(templateLogo)) {
        fs.copyFileSync(templateLogo, placeholderLogo);
        console.log('✅ Copied template logo to assets/logo.png');
      } else {
        // Create a simple text file as placeholder
        fs.writeFileSync(placeholderLogo + '.placeholder', 'Add your logo.png file here');
        console.log('✅ Created logo placeholder');
      }
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
