import json
import xml.etree.ElementTree as ET
import markdown
from typing import List
from fastapi import UploadFile, HTTPException
import aiofiles
from PyPDF2 import PdfReader

async def process_documents(documents: List[UploadFile]) -> List[dict]:
    document_data = []

    for document in documents:
        doc_info = {
            "filename": document.filename,
            "content": "",
            "type": document.content_type
        }

        try:
            if document.content_type == "text/plain":
                async with aiofiles.open(document.file, mode="r") as file:
                    doc_info["content"] = await file.read()

            elif document.content_type == "application/pdf":
                reader = PdfReader(document.file)
                pdf_content = []
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        pdf_content.append(text)
                doc_info["content"] = "\n".join(pdf_content)

            elif document.content_type == "application/json":
                content = await document.read()
                json_data = json.loads(content)
                doc_info["content"] = json.dumps(json_data, indent=2)

            elif document.content_type == "application/xml":
                content = await document.read()
                root = ET.fromstring(content)
                # Convert XML to string representation
                doc_info["content"] = ET.tostring(root, encoding='unicode', method='xml')

            elif document.content_type == "text/markdown":
                content = await document.read()
                # Convert markdown to HTML then strip tags for plain text
                html = markdown.markdown(content.decode())
                doc_info["content"] = html  # Keep HTML structure for better context

            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type: {document.content_type}"
                )

            document_data.append(doc_info)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing {document.filename}: {str(e)}"
            )

    return document_data
