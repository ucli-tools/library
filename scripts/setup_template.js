const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const projectRoot = path.join(__dirname, '..'); // Assumes script is in 'scripts' subdir

// Helper function to ask a question and get input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans)));
}

// Helper function to read a file
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Helper function to write content to a file
function writeFileContent(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Helper function to replace multiple placeholders in a file's content
function replaceInContent(content, replacements) {
  let newContent = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    // Use a RegExp for global replacement (all occurrences)
    // Escape special characters in placeholder for RegExp
    const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    newContent = newContent.replace(new RegExp(escapedPlaceholder, 'g'), value);
  }
  return newContent;
}

// Function to update a file with replacements
function updateFile(relativePath, replacements) {
  const filePath = path.join(projectRoot, relativePath);
  let content = readFileContent(filePath);
  if (content) {
    const newContent = replaceInContent(content, replacements);
    if (newContent !== content) {
      writeFileContent(filePath, newContent);
    } else {
      console.log(`No changes needed for ${path.basename(filePath)} with provided replacements.`);
    }
  }
}

async function main() {
  console.log('--- Astro Digital Library Template Setup ---');
  console.log('This script will help you customize your new library project.');
  console.log('Please provide the following details:');

  const projectName = await askQuestion('Project Name (e.g., my-awesome-library): ');
  const projectDescription = await askQuestion('Project Description: ');
  const authorName = await askQuestion('Author/Organization Name (e.g., Your Name or Your Org): ');
  const contactEmail = await askQuestion('Contact Email (e.g., contact@example.com): ');
  const websiteName = await askQuestion('Website/Library Name (e.g., My Digital Archive): ');
  const websiteUrl = await askQuestion('Full Website URL (e.g., https://mylibrary.example.com - for CNAME, optional): ');

  rl.close();

  // 1. Update package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  let packageJsonContent = readFileContent(packageJsonPath);
  if (packageJsonContent) {
    try {
      const packageObj = JSON.parse(packageJsonContent);
      packageObj.name = projectName || packageObj.name;
      packageObj.description = projectDescription || packageObj.description;
      packageObj.author = authorName || ''; // Add or update author
      // You might want to add other fields like 'version' or 'repository' here too
      writeFileContent(packageJsonPath, JSON.stringify(packageObj, null, 2));
    } catch (error) {
      console.error('Error parsing or updating package.json:', error);
    }
  }

  // 2. Update CNAME if URL provided
  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl);
      const cnamePath = path.join(projectRoot, 'CNAME');
      writeFileContent(cnamePath, url.hostname);
    } catch (error) {
      console.warn(`Invalid URL provided for CNAME: ${websiteUrl}. Skipping CNAME update.`);
    }
  } else {
    console.log('No website URL provided, skipping CNAME update. You can remove/update CNAME manually if needed.');
  }

  // 3. Define common replacements for .astro files
  const astroFileReplacements = {
    '[Your Website Name]': websiteName,
    '[Your Company/Organization Name]': authorName,
    '[Your Library Name]': websiteName, // Often the same as website name
    'contact@yourdomain.com': contactEmail,
    'privacy@yourdomain.com (Update this email address)': `${contactEmail} (Ensure this is your privacy contact)`,
    'legal@yourdomain.com (Update this email address)': `${contactEmail} (Ensure this is your legal contact)`,
    // Specific social link placeholders if desired, or remind user to do it manually
    'https://youtube.com/@YourChannel': `https://youtube.com/@${authorName.replace(/\s+/g, '')}`, // Basic example
    'https://yourname.substack.com': `https://${authorName.replace(/\s+/g, '').toLowerCase()}.substack.com`,
    'https://x.com/YourProfile': `https://x.com/${authorName.replace(/\s+/g, '')}`,
    'https://medium.com/@YourProfile': `https://medium.com/@${authorName.replace(/\s+/g, '').toLowerCase()}`,
    'https://github.com/YourUserOrOrg': `https://github.com/${authorName.replace(/\s+/g, '')}`
  };

  // Files to update with the above replacements
  const filesToUpdate = [
    'src/pages/index.astro',
    'src/pages/about.astro',
    'src/pages/contact.astro',
    'src/pages/privacy-policy.astro',
    'src/pages/terms-conditions.astro',
    'src/pages/social.astro',
    'src/layouts/Layout.astro' // For default title or other placeholders
    // Add other files here if they contain these common placeholders
  ];

  for (const file of filesToUpdate) {
    updateFile(file, astroFileReplacements);
  }
  
  // Update README.md
  const readmeReplacements = {
    'Astro Digital Library Template': `${websiteName} - A Digital Library`,
    'A generic template for creating a digital library with Astro.': projectDescription,
    'The Template Library': websiteName,
    'Template Author': authorName,
    // A more complex replacement for the ## Project Structure section if needed
    // For now, simple text replacement will do for title and intro.
  };
  updateFile('README.md', readmeReplacements);


  console.log('\n--- Setup Complete ---');
  console.log('Your project has been customized with the provided details.');
  console.log('\nIMPORTANT NEXT STEPS:');
  console.log('1. Review all changed files, especially `privacy-policy.astro` and `terms-conditions.astro`.');
  console.log('   YOU MUST CONSULT A LEGAL PROFESSIONAL for these legal documents.');
  console.log('2. Update `src/data/books.json` with your actual library content.');
  console.log('3. IMPORTANT: You MUST replace public/images/logo.png with your own logo image. This file serves as both the website logo and the browser tab icon. A placeholder is provided.');
  console.log('4. Update social media links in `src/pages/social.astro` if the auto-generated ones are not perfect.');
  console.log('5. Review `docs/template_update.md` for further guidance.');
  console.log('6. Commit these changes to your version control system.');
  console.log('\nTo start the development server, run: npm run dev (or yarn dev)');
}

main().catch(error => {
  console.error('An error occurred during setup:', error);
  rl.close();
});
