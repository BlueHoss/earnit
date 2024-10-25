import os
import fnmatch

# Frontend-specific directories to ignore
FRONTEND_IGNORED_DIRS = {
    'node_modules',
    'dist',
    'build',
    '.next',
    'coverage',
    '.svelte-kit',
    'public/assets',
    'storybook-static',
    '.git',
    'tmp',
    'temp',
    'assets',
    'static',
    'public',
    'images',
    'fonts',
    'icons',
    'locales',
    '__tests__',
    'test',
    'tests',
    'e2e',
    'cypress',
    'playwright',
}

# Frontend file patterns to ignore
FRONTEND_IGNORED_PATTERNS = {
    '*.min.js',
    '*.min.css',
    '*.map',
    '*.chunk.js',
    '*.bundle.js',
    '*.test.js',
    '*.test.ts',
    '*.spec.js',
    '*.spec.ts',
    '*.d.ts',
    '*.config.js',
    '*.setup.js',
    'setupTests.*',
    'serviceWorker.*',
    '*.stories.*',
    '*.test.jsx',
    '*.test.tsx',
    '*.spec.jsx',
    '*.spec.tsx',
    'types.ts',
    'constants.ts',
    'constants.js',
    '*.lock',
    'package-lock.json',
    'yarn.lock',
    '.DS_Store',
    '*.svg',
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.gif',
    '*.ico',
    '*.woff',
    '*.woff2',
    '*.ttf',
    '*.eot',
}

# Frontend file extensions to include
FRONTEND_EXTENSIONS = {
    # Core UI Files
    '.jsx', '.tsx',  # React files
    '.vue',          # Vue files
    '.svelte',       # Svelte files
    
    # Essential Styling
    '.css', '.scss', '.sass',
    
    # Core Templates
    '.html',
    
    # Essential Config
    'vite.config.js',
    'vite.config.ts',
    'svelte.config.js',
    'svelte.config.ts',
}

def is_essential_config(filepath):
    """Check if file is an essential configuration file we want to keep."""
    essential_configs = {
        'vite.config.js',
        'vite.config.ts',
        'svelte.config.js',
        'svelte.config.ts',
        'next.config.js',
        'next.config.ts',
        'nuxt.config.js',
        'nuxt.config.ts',
        'webpack.config.js',
        'webpack.config.ts',
    }
    return os.path.basename(filepath) in essential_configs

def should_include_frontend_file(file_path):
    """Determine if a frontend file should be included."""
    dir_path, filename = os.path.split(file_path)
    
    # Check if in ignored directory
    dir_parts = dir_path.split(os.sep)
    if any(part in FRONTEND_IGNORED_DIRS for part in dir_parts):
        return False
    
    # Check for ignored patterns
    if any(fnmatch.fnmatch(filename, pattern) for pattern in FRONTEND_IGNORED_PATTERNS):
        return False
    
    # Check if it's an essential config file
    if is_essential_config(file_path):
        return True
    
    # Get file extension
    _, ext = os.path.splitext(filename)
    return ext.lower() in FRONTEND_EXTENSIONS

def read_file(file_path):
    """Read file content with error handling."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if len(content.strip()) == 0:
                return "Empty file"
            if len(content) > 500000:  # Reduced to ~500KB
                return "File too large to include"
            return content
    except UnicodeDecodeError:
        return "Binary file - content not included"
    except Exception as e:
        return f"Error reading file: {str(e)}"

def escape_xml_chars(text):
    """Escape special XML characters."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&apos;')

def generate_frontend_xml(root_dir='.', output_file='frontend_structure.xml'):
    """Generate XML structure from frontend project files."""
    files_to_process = []
    total_size = 0
    max_total_size = 5000000  # ~5MB total limit
    
    # Walk through project directory
    for root, _, files in os.walk(root_dir):
        for file in files:
            file_path = os.path.join(root, file)
            if should_include_frontend_file(file_path):
                # Check file size
                try:
                    file_size = os.path.getsize(file_path)
                    if total_size + file_size <= max_total_size:
                        files_to_process.append(file_path)
                        total_size += file_size
                    else:
                        print(f"Skipping {file_path} - would exceed total size limit")
                except:
                    continue
    
    # Sort files for consistent output
    files_to_process.sort()
    
    # Start XML output
    xml_output = "<documents>\n"
    
    # Process each file
    for index, file_path in enumerate(files_to_process, 1):
        clean_path = os.path.relpath(file_path, root_dir)
        content = escape_xml_chars(read_file(file_path))
        
        xml_output += f'  <document index="{index}">\n'
        xml_output += f'    <source>{clean_path}</source>\n'
        xml_output += f'    <document_content>{content}</document_content>\n'
        xml_output += '  </document>\n'
    
    # Close XML structure
    xml_output += "</documents>"
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_output)
    
    print(f"Processed {len(files_to_process)} frontend files.")
    print(f"Total size: {total_size/1024/1024:.2f}MB")
    print(f"Generated {output_file} successfully.")
    print("\nIncluded frontend files:")
    for file in files_to_process:
        print(f"- {file}")

if __name__ == "__main__":
    # Use parent directory as root
    parent_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..')
    generate_frontend_xml(root_dir=parent_dir)