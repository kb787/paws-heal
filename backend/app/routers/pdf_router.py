from fastapi import APIRouter, HTTPException, File, UploadFile
from backend.app.services.pdf_service import process_pdf_and_embed
import os

router = APIRouter()


@router.post("/process-pdfs")
async def process_pdfs_endpoint(pdf_file: UploadFile = File(...)):
    """
    Endpoint to process a PDF file:
    - Processes and ingests the content into the vector database.
    """
    try:
        # Validate file type
        if pdf_file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        print(f"Received file type: {type(pdf_file)}")
        print(f"File name: {pdf_file.filename}")
        print(f"Content type: {pdf_file.content_type}")

        # Process the uploaded PDF
        result = await process_pdf_and_embed(pdf_file)

        return {"message": f"PDF file '{pdf_file.filename}' processed successfully."}

    except Exception as e:
        import traceback

        traceback.print_exc()  # This will print full stack trace
        raise HTTPException(
            status_code=500, detail=f"Error processing PDF file: {str(e)}"
        )
