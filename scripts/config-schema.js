#!/usr/bin/env node

/**
 * Configuration Schema and Validation
 * Defines the structure and validation rules for library configuration
 * Part of Phase 2: Interactive Setup System
 */

export const configSchema = {
  branding: {
    library: {
      name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
      tagline: { type: 'string', maxLength: 200 },
      description: { type: 'string', maxLength: 500 },
      author: { type: 'string', required: true },
      organization: { type: 'string' },
      website: { type: 'string', pattern: /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }
    },
    colors: {
      primary: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
      secondary: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
      accent: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
      background: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
      text: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ }
    },
    typography: {
      primary_font: { type: 'string' },
      heading_font: { type: 'string' },
      code_font: { type: 'string' }
    },
    logo: {
      enabled: { type: 'boolean' },
      path: { type: 'string' },
      alt_text: { type: 'string' },
      width: { type: 'number', min: 16, max: 500 },
      height: { type: 'number', min: 16, max: 500 }
    },
    theme: { 
      type: 'string', 
      enum: ['blue-professional', 'green-academic', 'purple-creative', 'orange-warm', 'gray-minimal'] 
    }
  },
  deployment: {
    domain: { type: 'string' },
    base_url: { type: 'string', pattern: /^https?:\/\/.+/ },
    seo: {
      meta_description: { type: 'string', maxLength: 160 },
      keywords: { type: 'string' },
      author: { type: 'string' },
      og_image: { type: 'string' }
    },
    analytics: {
      google_analytics: { type: 'string', pattern: /^G-[A-Z0-9]+$/ },
      plausible: { type: 'string' }
    },
    github_pages: {
      enabled: { type: 'boolean' },
      cname: { type: 'boolean' },
      subdomain: { type: 'string', pattern: /^[a-z0-9-]+$/ }
    }
  }
};

export const defaultConfig = {
  branding: {
    library: {
      name: '[Your Library Name]',
      tagline: 'Knowledge at your fingertips',
      description: 'A curated collection of thoughts, research, and insights',
      author: '[Your Name]',
      organization: '[Your Organization]',
      website: 'https://yourdomain.com'
    },
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1e293b'
    },
    typography: {
      primary_font: 'Inter, system-ui, sans-serif',
      heading_font: 'Inter, system-ui, sans-serif',
      code_font: 'JetBrains Mono, Consolas, monospace'
    },
    logo: {
      enabled: true,
      path: '/images/logo.png',
      alt_text: 'Library Logo',
      width: 48,
      height: 48
    },
    theme: 'blue-professional'
  },
  deployment: {
    domain: 'yourdomain.com',
    base_url: 'https://yourdomain.com',
    seo: {
      meta_description: 'A curated digital library of knowledge and insights',
      keywords: 'digital library, knowledge, research, insights',
      author: '[Your Name]',
      og_image: '/images/social-preview.png'
    },
    analytics: {
      google_analytics: '',
      plausible: ''
    },
    github_pages: {
      enabled: true,
      cname: false,
      subdomain: 'my-library'
    }
  }
};

export const themePresets = {
  'blue-professional': {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1e293b'
    }
  },
  'green-academic': {
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#dc2626',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  'purple-creative': {
    colors: {
      primary: '#7c3aed',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#fefefe',
      text: '#1e1b4b'
    }
  },
  'orange-warm': {
    colors: {
      primary: '#ea580c',
      secondary: '#78716c',
      accent: '#0891b2',
      background: '#fffbeb',
      text: '#1c1917'
    }
  },
  'gray-minimal': {
    colors: {
      primary: '#374151',
      secondary: '#9ca3af',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#111827'
    }
  }
};

/**
 * Validate configuration object against schema
 */
export function validateConfig(config, schema = configSchema) {
  const errors = [];
  
  function validateObject(obj, schemaObj, path = '') {
    for (const [key, rules] of Object.entries(schemaObj)) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj?.[key];
      
      // Check if required field is missing
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${fullPath} is required`);
        continue;
      }
      
      // Skip validation if value is undefined/null and not required
      if (value === undefined || value === null) continue;
      
      // Type validation
      if (rules.type) {
        const actualType = typeof value;
        if (actualType !== rules.type) {
          errors.push(`${fullPath} must be of type ${rules.type}, got ${actualType}`);
          continue;
        }
      }
      
      // String validations
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${fullPath} must be at least ${rules.minLength} characters long`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${fullPath} must be no more than ${rules.maxLength} characters long`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${fullPath} format is invalid`);
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${fullPath} must be one of: ${rules.enum.join(', ')}`);
        }
      }
      
      // Number validations
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${fullPath} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${fullPath} must be no more than ${rules.max}`);
        }
      }
      
      // Nested object validation
      if (typeof rules === 'object' && !rules.type && typeof value === 'object') {
        validateObject(value, rules, fullPath);
      }
    }
  }
  
  validateObject(config, schema);
  
  if (errors.length > 0) {
    throw new Error('Configuration validation failed:\n' + errors.map(e => `  - ${e}`).join('\n'));
  }
  
  return true;
}

/**
 * Apply theme preset to configuration
 */
export function applyTheme(config, themeName) {
  const theme = themePresets[themeName];
  if (!theme) {
    throw new Error(`Unknown theme: ${themeName}. Available themes: ${Object.keys(themePresets).join(', ')}`);
  }
  
  // Deep merge theme into config
  if (theme.colors) {
    config.branding = config.branding || {};
    config.branding.colors = { ...config.branding.colors, ...theme.colors };
  }
  
  config.branding.theme = themeName;
  return config;
}

/**
 * Get configuration with defaults applied
 */
export function getConfigWithDefaults(userConfig) {
  function deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  return deepMerge(defaultConfig, userConfig || {});
}
