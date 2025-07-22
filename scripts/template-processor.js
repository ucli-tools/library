#!/usr/bin/env node

/**
 * Template Processing Engine
 * Implements Handlebars-style syntax for configuration-driven customization
 * Part of Phase 2: Interactive Setup System
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class TemplateProcessor {
  constructor() {
    this.configDir = path.join(process.cwd(), 'library-config');
    this.srcDir = path.join(process.cwd(), 'src');
    this.config = {};
  }

  /**
   * Load all configuration files
   */
  async loadConfiguration() {
    try {
      // Load branding configuration
      const brandingPath = path.join(this.configDir, 'branding.yaml');
      if (fs.existsSync(brandingPath)) {
        const brandingContent = fs.readFileSync(brandingPath, 'utf8');
        this.config.branding = yaml.load(brandingContent);
      }

      // Load deployment configuration
      const deploymentPath = path.join(this.configDir, 'deployment.yaml');
      if (fs.existsSync(deploymentPath)) {
        const deploymentContent = fs.readFileSync(deploymentPath, 'utf8');
        this.config.deployment = yaml.load(deploymentContent);
      }

      // Load library structure
      const structurePath = path.join(this.configDir, 'library-structure.md');
      if (fs.existsSync(structurePath)) {
        this.config.structure = this.parseLibraryStructure(structurePath);
      }

      console.log('✅ Configuration loaded successfully');
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  /**
   * Parse library structure from markdown TOC
   */
  parseLibraryStructure(structurePath) {
    const content = fs.readFileSync(structurePath, 'utf8');
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;

    for (const line of lines) {
      // Category: - [Category Name](category-slug)
      const categoryMatch = line.match(/^- \[([^\]]+)\]\(([^)]+)\)$/);
      if (categoryMatch) {
        currentCategory = {
          name: categoryMatch[1],
          slug: categoryMatch[2],
          items: []
        };
        categories.push(currentCategory);
        continue;
      }

      // Item: - [Item Name](path/to/file.md)
      const itemMatch = line.match(/^  - \[([^\]]+)\]\(([^)]+)\)$/);
      if (itemMatch && currentCategory) {
        currentCategory.items.push({
          title: itemMatch[1],
          path: itemMatch[2]
        });
      }
    }

    return { categories };
  }

  /**
   * Process template variables in content
   * Supports: {{ variable }}, {{#if condition}}, {{#each array}}, [Bracket Placeholders]
   */
  processTemplate(content, context = null) {
    const ctx = context || this.config;
    
    // Process bracket-style placeholders first (backward compatibility)
    content = this.processBracketPlaceholders(content, ctx);
    
    // Simple variable substitution: {{ variable }}
    content = content.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
      return this.getNestedValue(ctx, path.trim()) || match;
    });

    // Conditional blocks: {{#if condition}}...{{/if}}
    content = content.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, block) => {
      const value = this.getNestedValue(ctx, condition.trim());
      return this.isTruthy(value) ? this.processTemplate(block, ctx) : '';
    });

    // Each blocks: {{#each array}}...{{/each}}
    content = content.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, block) => {
      const array = this.getNestedValue(ctx, arrayPath.trim());
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        // Create context with current item
        const itemContext = { ...ctx, this: item, ...item };
        return this.processTemplate(block, itemContext);
      }).join('');
    });

    return content;
  }

  /**
   * Get nested object value by dot notation path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Process bracket-style placeholders for backward compatibility
   * [Your Library Name] -> actual library name
   */
  processBracketPlaceholders(content, ctx) {
    const placeholders = {
      '[Your Library Name]': ctx.branding?.library?.name || '[Your Library Name]',
      '[Your Organization]': ctx.branding?.library?.organization || '[Your Organization]',
      '[Your Name]': ctx.branding?.library?.author || '[Your Name]',
      'yourdomain.com': ctx.deployment?.domain || 'yourdomain.com',
      'https://yourdomain.com': ctx.deployment?.base_url || 'https://yourdomain.com'
    };
    
    for (const [placeholder, replacement] of Object.entries(placeholders)) {
      content = content.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), replacement);
    }
    
    return content;
  }
  
  /**
   * Escape special regex characters
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Check if value is truthy for template conditions
   */
  isTruthy(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return value !== 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return Boolean(value);
  }

  /**
   * Process all template files in src directory
   */
  async processAllTemplates() {
    console.log('🎨 Processing templates with configuration...');
    
    await this.loadConfiguration();
    
    // Process assets (logo, favicon, etc.)
    await this.processAssets();
    
    // Process Astro components
    await this.processDirectory(path.join(this.srcDir, 'components'));
    await this.processDirectory(path.join(this.srcDir, 'layouts'));
    await this.processDirectory(path.join(this.srcDir, 'pages'));
    
    // Process CSS files
    await this.processFile(path.join(this.srcDir, 'styles', 'global.css'));
    
    // Generate CSS variables from configuration
    await this.generateCSSVariables();
    
    console.log('✅ Template processing complete!');
  }

  /**
   * Process all files in a directory
   */
  async processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await this.processDirectory(filePath);
      } else if (file.endsWith('.astro') || file.endsWith('.css') || file.endsWith('.js')) {
        await this.processFile(filePath);
      }
    }
  }

  /**
   * Process a single template file
   */
  async processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const processed = this.processTemplate(content);
      
      // Only write if content changed
      if (processed !== content) {
        fs.writeFileSync(filePath, processed);
        console.log(`  ✓ Processed ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Generate CSS variables from configuration
   */
  async generateCSSVariables() {
    const cssPath = path.join(this.srcDir, 'styles', 'config-generated.css');
    
    let css = '/* Auto-generated CSS variables from library-config/ */\n';
    css += '/* DO NOT EDIT - This file is regenerated by build-config */\n\n';
    css += ':root {\n';
    
    // Library information
    if (this.config.branding?.library) {
      const library = this.config.branding.library;
      if (library.name) css += `  --library-name: "${library.name}";\n`;
      if (library.tagline) css += `  --library-tagline: "${library.tagline}";\n`;
      if (library.author) css += `  --library-author: "${library.author}";\n`;
      if (library.organization) css += `  --library-organization: "${library.organization}";\n`;
    }
    
    // Branding colors
    if (this.config.branding?.colors) {
      const colors = this.config.branding.colors;
      if (colors.primary) css += `  --color-primary: ${colors.primary};\n`;
      if (colors.secondary) css += `  --color-secondary: ${colors.secondary};\n`;
      if (colors.accent) css += `  --color-accent: ${colors.accent};\n`;
      if (colors.background) css += `  --color-background: ${colors.background};\n`;
      if (colors.text) css += `  --color-text: ${colors.text};\n`;
    }
    
    // Typography
    if (this.config.branding?.typography) {
      const typography = this.config.branding.typography;
      if (typography.primary_font) css += `  --font-primary: ${typography.primary_font};\n`;
      if (typography.heading_font) css += `  --font-heading: ${typography.heading_font};\n`;
      if (typography.code_font) css += `  --font-code: ${typography.code_font};\n`;
    }
    
    css += '}\n\n';
    
    // Add theme-specific overrides
    if (this.config.branding?.theme) {
      css += `/* Theme: ${this.config.branding.theme} */\n`;
      css += 'body {\n';
      if (this.config.branding.colors?.background) {
        css += `  background-color: var(--color-background);\n`;
      }
      if (this.config.branding.colors?.text) {
        css += `  color: var(--color-text);\n`;
      }
      if (this.config.branding.typography?.primary_font) {
        css += `  font-family: var(--font-primary);\n`;
      }
      css += '}\n\n';
      
      // Apply primary color to key elements
      if (this.config.branding.colors?.primary) {
        css += `/* Primary color applications */\n`;
        css += `a { color: var(--color-primary); }\n`;
        css += `h1, h2, h3, h4, h5, h6 { color: var(--color-primary); }\n`;
        css += `.btn-primary { background-color: var(--color-primary); }\n`;
      }
    }
    
    fs.writeFileSync(cssPath, css);
    console.log('  ✓ Generated CSS variables and theme styles');
  }

  /**
   * Process assets (logo, favicon, etc.)
   */
  async processAssets() {
    const assetsDir = path.join(this.configDir, 'assets');
    const publicDir = path.join(process.cwd(), 'public');
    
    // Check if custom logo exists
    const logoPath = path.join(assetsDir, 'logo.png');
    if (fs.existsSync(logoPath)) {
      // Copy logo to public/images/
      const targetLogoPath = path.join(publicDir, 'images', 'logo.png');
      fs.copyFileSync(logoPath, targetLogoPath);
      console.log('  ✓ Updated logo.png');
      
      // Update logo reference in template files
      this.config.branding = this.config.branding || {};
      this.config.branding.logo = this.config.branding.logo || {};
      this.config.branding.logo.path = '/images/logo.png';
      this.config.branding.logo.enabled = true;
    }
  }

  /**
   * Validate configuration against schema
   */
  validateConfiguration() {
    const errors = [];
    
    // Validate required branding fields
    if (!this.config.branding?.library?.name) {
      errors.push('branding.library.name is required');
    }
    
    // Validate color formats
    if (this.config.branding?.colors) {
      const colors = this.config.branding.colors;
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      
      if (colors.primary && !hexPattern.test(colors.primary)) {
        errors.push('branding.colors.primary must be a valid hex color (e.g., #2563eb)');
      }
      if (colors.secondary && !hexPattern.test(colors.secondary)) {
        errors.push('branding.colors.secondary must be a valid hex color');
      }
      if (colors.accent && !hexPattern.test(colors.accent)) {
        errors.push('branding.colors.accent must be a valid hex color');
      }
    }
    
    if (errors.length > 0) {
      throw new Error('Configuration validation failed:\n' + errors.map(e => `  - ${e}`).join('\n'));
    }
    
    console.log('✅ Configuration validation passed');
  }
}

export default TemplateProcessor;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const processor = new TemplateProcessor();
  
  try {
    await processor.processAllTemplates();
  } catch (error) {
    console.error('❌ Template processing failed:', error.message);
    process.exit(1);
  }
}
