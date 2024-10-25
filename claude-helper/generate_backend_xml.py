import os
import fnmatch

# Backend-specific directories to ignore
BACKEND_IGNORED_DIRS = {
    'venv',
    'env',
    '__pycache__',
    '.pytest_cache',
    'migrations',
    'node_modules',
    'target',
    'bin',
    'obj',
}

# Backend file extensions to include
BACKEND_EXTENSIONS = {
    # Python
    '.py', '.pyi', '.pyw',
    # Java/Kotlin
    '.java', '.kt', '.gradle',
    # C#/.NET
    '.cs', '.vb', '.fs',
    # Ruby
    '.rb', '.rake',
    # PHP
    '.php',
    # Go
    '.go',
    # Rust
    '.rs',
    # Config Files
    '.yml', '.yaml', '.toml', '.ini',
    # Database
    '.sql',
    # Shell Scripts
    '.sh', '.bash',
    # Documentation
    '.md',
}

def should_include_backend_file(file_path):
    """Determine if a backend file should be included."""
    dir_path, filename = os.path.split(file_path)
    
    # Check if in ignored directory
    dir_parts = dir_path.split(os.sep)
    if any(part in BACKEND_IGNORED_DIRS for part in dir_parts):
        return False
    
    # Get file extension
    _, ext = os.path.splitext(filename)
    return ext.lower() in BACKEND_EXTENSIONS

def read_file(file_path):
    """Read file content with error handling."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if len(content.strip()) == 0:
                return "Empty file"
            if len(content) > 1000000:  # Skip files larger than ~1MB
                return "File too large to include"
            return content
    except UnicodeDecodeError:
        return "Binary file - content not included"
    except Exception as e:
        return f"Error reading file: {str(e)}"

def escape_xml_chars(text):
    """Escape special XML characters."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&apos;')

def generate_backend_xml(root_dir='.', output_file='backend_structure.xml'):
    """Generate XML structure from backend project files."""
    files_to_process = []
    
    # Walk through project directory
    for root, _, files in os.walk(root_dir):
        for file in files:
            file_path = os.path.join(root, file)
            if should_include_backend_file(file_path):
                files_to_process.append(file_path)
    
    # Sort files for consistent output
    files_to_process.sort()
    
    # Start XML output
    xml_output = "<documents>\n"
    
    # Process each file
    for index, file_path in enumerate(files_to_process, 1):
        clean_path = file_path[2:] if file_path.startswith('./') else file_path
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
    
    print(f"Processed {len(files_to_process)} backend files.")
    print(f"Generated {output_file} successfully.")
    print("\nIncluded backend files:")
    for file in files_to_process:
        print(f"- {file}")

if __name__ == "__main__":
    # Use parent directory as root
    parent_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..')
    generate_backend_xml(root_dir=parent_dir)