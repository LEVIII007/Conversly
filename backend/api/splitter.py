from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    MarkdownTextSplitter,
    SemanticChunker
)
import re

# Function to read and chunk text specifically for plain text content
def chunk_text(content):
    # Split content into chunks based on '###' headings or max words per chunk
    chunks = re.split(r"(?<=###)\s*", content)  # Split by headings
    final_chunks = []
    for chunk in chunks:
        words = chunk.strip().split()
        while len(words) > 300:
            final_chunks.append(' '.join(words[:300]))
            words = words[300:]
        if words:
            final_chunks.append(' '.join(words))
    return final_chunks


# Factory function to create appropriate text splitters
def get_text_splitter(content_type: str):
    """
    Returns a text splitter based on the content type.
    """
    # For PDFs and TXT files - use semantic chunking
    if content_type in ["application/pdf", "text/plain"]:
        return SemanticChunker(
            chunk_size=300,
            chunk_overlap=50
        )
    
    # For Markdown files
    elif content_type == "text/markdown":
        return MarkdownTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    # For JSON, XML, and other structured data
    elif content_type in ["application/json", "application/xml"]:
        return RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
    
    # For websites - use semantic chunking
    elif content_type == "website":
        return SemanticChunker(
            chunk_size=300,
            chunk_overlap=50
        )
    
    # For Q&A - no splitting needed
    elif content_type == "qa":
        return None
    
    # Default fallback
    else:
        return RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )


# Specialized splitting logic for JSON and CSV files
def split_json(json_content):
    """
    Custom logic for splitting JSON content into meaningful chunks.
    """
    import json
    try:
        data = json.loads(json_content)
        chunks = []
        for key, value in data.items():
            if isinstance(value, dict):
                chunks.append(json.dumps(value))  # Add nested dict as a chunk
            elif isinstance(value, list):
                for item in value:
                    chunks.append(json.dumps(item))  # Each list item as a chunk
            else:
                chunks.append(f"{key}: {value}")
        return chunks
    except json.JSONDecodeError:
        return chunk_text(json_content)  # Fallback to basic chunking


def split_csv(csv_content):
    """
    Custom logic for splitting CSV content into rows or smaller chunks.
    """
    import csv
    from io import StringIO

    rows = []
    reader = csv.reader(StringIO(csv_content))
    header = next(reader, None)  # Read the header
    if header:
        rows.append(", ".join(header))  # Include header as the first chunk

    for row in reader:
        rows.append(", ".join(row))  # Each row as a chunk

    return chunk_text("\n".join(rows))  # Further split rows if too large


# Example Usage
if __name__ == "__main__":
    markdown_splitter = get_text_splitter("text/markdown")
    json_splitter = get_text_splitter("application/json")
    csv_splitter = get_text_splitter("text/csv")

    # Use these splitters or specific functions like split_json/split_csv for processing
