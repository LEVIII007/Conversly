from typing import List
from fastapi import UploadFile
import aiofiles
from PyPDF2 import PdfReader
from fastapi import HTTPException

async def process_documents(documents: List[UploadFile]) -> List[str]:
    document_texts = []

    for document in documents:
        # Read TXT files
        if document.content_type == "text/plain":
            async with aiofiles.open(document.file, mode="r") as file:
                content = await file.read()
                document_texts.append(content)

        # Read PDF files
        elif document.content_type == "application/pdf":
            document.file.seek(0)  # Reset file pointer
            reader = PdfReader(document.file)
            pdf_content = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pdf_content.append(text)
            document_texts.append("\n".join(pdf_content))

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {document.content_type}")

    return document_texts
