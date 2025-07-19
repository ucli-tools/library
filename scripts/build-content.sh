#!/bin/bash

# Build Content Script - Universalis Library Template
# Uses the Universalis ecosystem tools to process markdown content

set -e

echo "🚀 Building library content using Universalis ecosystem..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are available
check_tool() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        echo -e "${YELLOW}💡 Install with: ucli build $1${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 is available${NC}"
        return 0
    fi
}

# Create output directories
echo -e "${BLUE}📁 Creating output directories...${NC}"
mkdir -p public/pdfs/{books,articles,guides}
mkdir -p public/audio/{books,articles,guides}
mkdir -p public/epub/{books,articles,guides}

# Process content by type
process_content_type() {
    local content_type="$1"
    local input_dir="content/$content_type"
    local pdf_dir="public/pdfs/$content_type"
    local audio_dir="public/audio/$content_type"
    local epub_dir="public/epub/$content_type"
    
    if [ ! -d "$input_dir" ]; then
        echo -e "${YELLOW}⚠️  No $content_type directory found, skipping...${NC}"
        return
    fi
    
    echo -e "${BLUE}📚 Processing $content_type...${NC}"
    
    # Find all markdown files
    find "$input_dir" -name "*.md" -type f | while read -r file; do
        filename=$(basename "$file" .md)
        echo -e "${YELLOW}  Processing: $filename${NC}"
        
        # Generate PDF with mdtexpdf
        if check_tool "mdtexpdf" > /dev/null 2>&1; then
            echo -e "    📄 Generating PDF..."
            mdtexpdf "$file" --output-dir "$pdf_dir" || echo -e "${RED}    ❌ PDF generation failed${NC}"
        fi
        
        # Generate audiobook with mdaudiobook
        if check_tool "mdaudiobook" > /dev/null 2>&1; then
            echo -e "    🎵 Generating audiobook..."
            mdaudiobook "$file" --output-dir "$audio_dir" || echo -e "${RED}    ❌ Audio generation failed${NC}"
        fi
        
        # Generate ePub with mdepub
        if check_tool "mdepub" > /dev/null 2>&1; then
            echo -e "    📖 Generating ePub..."
            mdepub "$file" --output-dir "$epub_dir" || echo -e "${RED}    ❌ ePub generation failed${NC}"
        fi
    done
}

# Main execution
echo -e "${BLUE}🔍 Checking Universalis ecosystem tools...${NC}"

tools_available=0
if check_tool "mdtexpdf"; then ((tools_available++)); fi
if check_tool "mdaudiobook"; then ((tools_available++)); fi  
if check_tool "mdepub"; then ((tools_available++)); fi

if [ $tools_available -eq 0 ]; then
    echo -e "${RED}❌ No Universalis tools found!${NC}"
    echo -e "${YELLOW}💡 Install tools with:${NC}"
    echo -e "   ucli build mdtexpdf mdaudiobook mdepub"
    exit 1
fi

echo -e "${GREEN}✅ Found $tools_available Universalis tools${NC}"

# Process each content type
process_content_type "books"
process_content_type "articles" 
process_content_type "guides"

# Update library content index
echo -e "${BLUE}📋 Updating library content index...${NC}"
if [ -f "scripts/update-library-index.js" ]; then
    node scripts/update-library-index.js
else
    echo -e "${YELLOW}⚠️  Library index updater not found, skipping...${NC}"
fi

echo -e "${GREEN}🎉 Content build complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   PDFs: $(find public/pdfs -name "*.pdf" 2>/dev/null | wc -l)"
echo -e "   Audio: $(find public/audio -name "*.mp3" 2>/dev/null | wc -l)"
echo -e "   ePubs: $(find public/epub -name "*.epub" 2>/dev/null | wc -l)"
