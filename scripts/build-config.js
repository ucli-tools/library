#!/usr/bin/env node

/**
 * Template Configuration Builder
 * Processes library-config/ files and generates the actual library templates
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { marked } from 'marked';

// Configure marked for proper HTML generation
marked.setOptions({
  gfm: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

// Color themes
const THEMES = {
  'blue-professional': {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#1e293b',
    accent: '#f59e0b'
  },
  'green-academic': {
    primary: '#059669',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#d97706'
  },
  'purple-creative': {
    primary: '#7c3aed',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#ec4899'
  },
  'orange-warm': {
    primary: '#ea580c',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#8b5cf6'
  },
  'gray-minimal': {
    primary: '#374151',
    secondary: '#9ca3af',
    background: '#ffffff',
    text: '#111827',
    accent: '#6366f1'
  }
};

class ConfigBuilder {
  constructor() {
    this.configDir = path.join(process.cwd(), 'library-config');
    this.srcDir = path.join(process.cwd(), 'src');
    this.config = {};
  }

  async build() {
    console.log('🔧 Building library configuration...');
    
    try {
      // Load all configuration files
      await this.loadConfigs();
      
      // Process library structure (TOC)
      await this.processLibraryStructure();
      
      // Generate CSS variables
      await this.generateCSS();
      
      // Process static pages
      await this.processStaticPages();
      
      // Update Astro components
      await this.updateComponents();
      
      console.log('✅ Configuration build complete!');
      
    } catch (error) {
      console.error('❌ Configuration build failed:', error.message);
      process.exit(1);
    }
  }

  async loadConfigs() {
    console.log('📖 Loading configuration files...');
    
    // Load branding config
    const brandingPath = path.join(this.configDir, 'branding.yaml');
    if (fs.existsSync(brandingPath)) {
      const brandingContent = fs.readFileSync(brandingPath, 'utf8');
      this.config.branding = yaml.load(brandingContent);
    } else {
      throw new Error('branding.yaml not found in library-config/');
    }

    // Load deployment config
    const deploymentPath = path.join(this.configDir, 'deployment.yaml');
    if (fs.existsSync(deploymentPath)) {
      const deploymentContent = fs.readFileSync(deploymentPath, 'utf8');
      this.config.deployment = yaml.load(deploymentContent);
    }

    // Process theme colors
    this.processTheme();
  }

  processTheme() {
    const branding = this.config.branding;
    const theme = branding.theme;
    
    if (theme && THEMES[theme]) {
      // Start with theme colors
      const themeColors = THEMES[theme];
      
      // Override with custom colors if provided
      if (branding.colors) {
        branding.colors = { ...themeColors, ...branding.colors };
      } else {
        branding.colors = themeColors;
      }
    } else if (!branding.colors) {
      // Default to blue-professional if no theme or colors specified
      branding.colors = THEMES['blue-professional'];
    }
  }

  async processLibraryStructure() {
    console.log('📚 Processing library structure...');
    
    const structurePath = path.join(this.configDir, 'library-structure.md');
    if (!fs.existsSync(structurePath)) {
      console.log('⚠️  No library-structure.md found, using existing library_content.json');
      return;
    }

    const structureContent = fs.readFileSync(structurePath, 'utf8');
    const libraryContent = this.parseLibraryStructure(structureContent);
    
    // Write generated library content
    const outputPath = path.join(this.srcDir, 'data', 'library_content.json');
    fs.writeFileSync(outputPath, JSON.stringify(libraryContent, null, 2));
    
    console.log(`📝 Generated library_content.json with ${Object.keys(libraryContent).length} categories`);
  }

  parseLibraryStructure(content) {
    const lines = content.split('\n');
    const libraryContent = {};
    let currentCategory = null;
    let currentCategorySlug = null;
    let inContentSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if we're entering the Content Categories section
      if (trimmed === '## Content Categories') {
        inContentSection = true;
        continue;
      }
      
      // Stop processing when we hit the documentation section
      if (trimmed.startsWith('---') || trimmed === '## How to Customize') {
        inContentSection = false;
        break;
      }
      
      // Skip empty lines, comments, and lines outside content section
      if (!trimmed || trimmed.startsWith('#') || !inContentSection) {
        continue;
      }

      // Category line: - [Category Name](slug) (no indentation)
      const categoryMatch = trimmed.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)$/);
      if (categoryMatch && !line.startsWith('  ')) {
        const [, categoryName, categorySlug] = categoryMatch;
        currentCategory = categoryName;
        currentCategorySlug = categorySlug;
        libraryContent[categorySlug] = [];
        continue;
      }

      // Content item line:   - [Title](path/to/file.md) (indented with 2+ spaces)
      const itemMatch = trimmed.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)$/);
      if (itemMatch && line.startsWith('  ') && currentCategorySlug) {
        const [, title, filePath] = itemMatch;
        
        // Extract slug from file path
        const slug = path.basename(filePath, '.md');
        
        // Check if corresponding files exist
        const markdownPath = path.join(process.cwd(), 'content', filePath);
        const pdfPath = path.join(process.cwd(), 'public', 'pdfs', filePath.replace('.md', '.pdf'));
        
        if (fs.existsSync(markdownPath)) {
          // Try to extract metadata from markdown frontmatter
          const markdownContent = fs.readFileSync(markdownPath, 'utf8');
          const metadata = this.extractFrontmatter(markdownContent);
          
          const item = {
            type: metadata.type || 'article',
            title: metadata.title || title,
            slug: slug,
            author: metadata.author || this.config.branding?.library?.author || '[Your Name]',
            summary: metadata.description || metadata.summary || `${title} - part of ${currentCategory}`,
            pdfUrl: fs.existsSync(pdfPath) ? `/pdfs/${filePath.replace('.md', '.pdf')}` : null,
            markdownUrl: `/content/${filePath}`
          };
          
          libraryContent[currentCategorySlug].push(item);
        } else {
          console.log(`⚠️  Markdown file not found: ${markdownPath}`);
        }
      }
    }

    return libraryContent;
  }

  extractFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      try {
        return yaml.load(frontmatterMatch[1]) || {};
      } catch (error) {
        console.log('⚠️  Error parsing frontmatter:', error.message);
        return {};
      }
    }
    return {};
  }

  async generateCSS() {
    console.log('🎨 Generating CSS variables...');
    
    const branding = this.config.branding;
    const cssTemplate = `/* Generated CSS Variables - DO NOT EDIT MANUALLY */
/* Edit library-config/branding.yaml and run 'make build-config' to regenerate */

:root {
  /* Library branding */
  --library-name: "${branding.library?.name || '[Your Library Name]'}";
  --library-tagline: "${branding.library?.tagline || 'Knowledge at your fingertips'}";
  
  /* Colors */
  --primary-color: ${branding.colors?.primary || '#2563eb'};
  --secondary-color: ${branding.colors?.secondary || '#64748b'};
  --background-color: ${branding.colors?.background || '#ffffff'};
  --text-color: ${branding.colors?.text || '#1e293b'};
  --accent-color: ${branding.colors?.accent || '#f59e0b'};
  --link-color: var(--primary-color);
  
  /* Typography */
  --font-primary: ${branding.typography?.primary_font || 'Inter, system-ui, sans-serif'};
  --font-heading: ${branding.typography?.heading_font || 'Inter, system-ui, sans-serif'};
  --font-code: ${branding.typography?.code_font || 'JetBrains Mono, Consolas, monospace'};
  --font-size-base: ${branding.typography?.font_size_base || '16px'};
  --line-height: ${branding.typography?.line_height || '1.6'};
  
  /* Logo */
  --logo-width: ${branding.logo?.width || '200px'};
  --logo-height: ${branding.logo?.height || 'auto'};
}

/* Dark mode overrides */
[data-theme="dark"] {
  --background-color: #0f172a;
  --text-color: #e2e8f0;
  --secondary-color: #64748b;
}

/* Apply typography */
body {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--text-color);
  background-color: var(--background-color);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

code, pre {
  font-family: var(--font-code);
}

/* Apply colors */
a {
  color: var(--link-color);
}

.primary-bg {
  background-color: var(--primary-color);
}

.accent-bg {
  background-color: var(--accent-color);
}
`;

    const outputPath = path.join(this.srcDir, 'styles', 'config-generated.css');
    fs.writeFileSync(outputPath, cssTemplate);
    
    console.log('🎨 Generated config-generated.css');
  }

  async processStaticPages() {
    console.log('📄 Processing static pages...');
    
    const pagesDir = path.join(this.configDir, 'pages');
    if (!fs.existsSync(pagesDir)) {
      console.log('⚠️  No pages directory found in library-config/');
      return;
    }

    const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
    
    for (const pageFile of pageFiles) {
      const pageName = path.basename(pageFile, '.md');
      const markdownPath = path.join(pagesDir, pageFile);
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      
      // Generate Astro page
      const astroContent = this.generateAstroPage(pageName, markdownContent);
      
      // Determine output filename
      let outputFile;
      if (pageName === 'terms') {
        outputFile = 'terms-conditions.astro';
      } else if (pageName === 'privacy') {
        outputFile = 'privacy-policy.astro';
      } else {
        outputFile = `${pageName}.astro`;
      }
      
      const outputPath = path.join(this.srcDir, 'pages', outputFile);
      fs.writeFileSync(outputPath, astroContent);
      
      console.log(`📄 Generated ${outputFile} from ${pageFile}`);
    }
  }

  generateAstroPage(pageName, markdownContent) {
    const branding = this.config.branding;
    const libraryName = branding.library?.name || '[Your Library Name]';
    
    // Process markdown content to replace placeholders
    const processedMarkdown = this.processMarkdownPlaceholders(markdownContent);
    
    // Convert markdown to HTML
    const htmlContent = marked(processedMarkdown);
    
    const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    // Properly escape the HTML content for Astro template
    const escapedHtml = htmlContent
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
    
    return `---
// Generated from library-config/pages/${pageName}.md
// Edit the markdown file and run 'make build-config' to regenerate
import Layout from '../layouts/Layout.astro';

const htmlContent = \`${escapedHtml}\`;
---

<Layout title="${pageTitle} | ${libraryName}" currentPage="/${pageName}/">
  <div class="content-page">
    <div class="markdown-content" set:html={htmlContent}>
    </div>
  </div>
</Layout>

<style>
  .content-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .markdown-content {
    line-height: 1.7;
  }
  
  .markdown-content h1 {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
  }
  
  .markdown-content h2 {
    color: var(--text-color);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  .markdown-content h3 {
    color: var(--secondary-color);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .markdown-content p {
    margin-bottom: 1rem;
  }
  
  .markdown-content ul, .markdown-content ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  .markdown-content li {
    margin-bottom: 0.5rem;
  }
  
  .markdown-content a {
    color: var(--link-color);
    text-decoration: underline;
  }
  
  .markdown-content a:hover {
    opacity: 0.8;
  }
  
  .markdown-content code {
    background-color: var(--secondary-color);
    color: var(--background-color);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
  
  .markdown-content pre {
    background-color: var(--secondary-color);
    color: var(--background-color);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  .markdown-content blockquote {
    border-left: 4px solid var(--accent-color);
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: var(--secondary-color);
  }
</style>`;
  }

  processMarkdownPlaceholders(content) {
    const branding = this.config.branding;
    const deployment = this.config.deployment;
    
    // Replace common placeholders
    return content
      .replace(/\[Your Library Name\]/g, branding.library?.name || '[Your Library Name]')
      .replace(/\[Your Name\/Organization\]/g, branding.library?.organization || branding.library?.author || '[Your Name/Organization]')
      .replace(/\[Your Name\]/g, branding.library?.author || '[Your Name]')
      .replace(/\[Your Organization\]/g, branding.library?.organization || '[Your Organization]')
      .replace(/\[Your Website\]/g, branding.library?.website || 'https://yourwebsite.com')
      .replace(/\[Your Jurisdiction\]/g, deployment?.jurisdiction || '[Your Jurisdiction]')
      .replace(/\[your\.email@example\.com\]\(mailto:your\.email@example\.com\)/g, 
        deployment?.contact_email ? `[${deployment.contact_email}](mailto:${deployment.contact_email})` : '[your.email@example.com](mailto:your.email@example.com)')
      .replace(/yourwebsite\.com/g, branding.library?.website?.replace('https://', '') || 'yourwebsite.com')
      .replace(/\[Month\] \[Day\], \[Year\]/g, new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
  }

  async updateComponents() {
    console.log('🔧 Updating components...');
    
    // Update Layout.astro with new CSS import
    const layoutPath = path.join(this.srcDir, 'layouts', 'Layout.astro');
    if (fs.existsSync(layoutPath)) {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      // Add import for generated CSS if not already present
      if (!layoutContent.includes('config-generated.css')) {
        layoutContent = layoutContent.replace(
          /import '\.\.\/styles\/global\.css';/,
          `import '../styles/global.css';\nimport '../styles/config-generated.css';`
        );
        fs.writeFileSync(layoutPath, layoutContent);
        console.log('🔧 Updated Layout.astro with generated CSS import');
      }
    }
  }
}

// Run the builder
const builder = new ConfigBuilder();
builder.build().catch(console.error);

export default ConfigBuilder;
