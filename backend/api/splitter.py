from langchain_experimental.text_splitter import SemanticChunker
from langchain.docstore.document import Document
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    MarkdownTextSplitter,
)
from gemini_embedder import DocumentEmbedder
import re
from dotenv import load_dotenv

load_dotenv()

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

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
def get_text_splitter(content_type: str, content: str):
    """
    Returns a text splitter based on the content type.
    """
    embedder = DocumentEmbedder()
    # For PDFs, TXT files, and websites - use semantic chunking
    if content_type in ["application/pdf", "text/plain", "website"]:
        print("using semantic chunker")
        text_splitter = SemanticChunker(
            embedder,
            breakpoint_threshold_type="percentile",  # or "standard_deviation"
        )
        print(content)
        text = Document(page_content=content)
        docs = text_splitter.split_documents([text])
        print(f"Generated {len(docs)} chunks")
        print(docs)
        return [doc.page_content for doc in docs]


    
    # For Markdown files
    elif content_type == "text/markdown":
        print("using markdown splitter")
        text_splitter = MarkdownTextSplitter(
            headers_to_split_on=headers_to_split_on,
            strip_headers=False,
            chunk_size=1000,
            chunk_overlap=200
        )
        docs = text_splitter.split_text([content])
        return [doc.page_content for doc in docs]

    
    # For JSON, XML, and other structured data
    elif content_type in ["application/json", "application/xml"]:
        print("using recursive character text splitter")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n"]
        )
        docs = text_splitter.create_documents(content)
        return docs
         
    
    # Default fallback
    else:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        docs = text_splitter.create_documents(content)
        return docs


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


# # Example Usage
# if __name__ == "__main__":
#     markdown_splitter = get_text_splitter("text/markdown")
#     json_splitter = get_text_splitter("application/json")
#     csv_splitter = get_text_splitter("text/csv")

#     # Use these splitters or specific functions like split_json/split_csv for processing
