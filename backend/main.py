
from fastapi import Depends, FastAPI, HTTPException, UploadFile
import shutil, uuid, os
import pandas as pd
# from ai_cleaner import format_text_to_excel_structure
from convert_to_excel import save_to_excel
from fastapi.responses import FileResponse
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager
from pydantic import BaseModel
from cleanup import delete_old_files
from process_full_pdf import process_full_pdf
from database import get_db
from sqlalchemy.orm import Session
from model import FeedbackModel
from verify_admin import verify_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(delete_old_files())
    yield
    task.cancel()
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://doc2excel.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Feedback(BaseModel):
    rating:int
    comment:str




def extract_pdf_text(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def clean_csv_text(csv_text: str) -> str:
    return csv_text.replace('\x00', '').replace('"', '')  # Remove nulls & double quotes

@app.post("/convert")
async def convert_pdf_to_excel(file: UploadFile):
    file_id = str(uuid.uuid4())[:8]
    temp_pdf_path = f"temp_{file_id}.pdf"
    output_excel_path = f"output_{file_id}.xlsx"

    # Save uploaded PDF
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract and process text
    # raw_text = extract_pdf_text(temp_pdf_path)
    # print("Extracted text from PDF:", raw_text)  # Debugging line
    # structured_csv = format_text_to_excel_structure(raw_text)
    structured_csv=process_full_pdf(temp_pdf_path)
    # print("Structured CSV:", structured_csv)  # Debugging line
    csv_text = clean_csv_text(structured_csv)
    save_to_excel(csv_text, output_excel_path)

   
    os.remove(temp_pdf_path)

    return {
        "message": "Excel generated",
        "download_url": f"download/{output_excel_path}"
    }

@app.get("/download/{filename}")
def download_excel(filename: str):
    path = os.path.join(".", filename)
    if not os.path.exists(path):
        return {"error": "File not found"}
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )
@app.post("/feedback")
def feedback(feedback:Feedback,db:Session=Depends(get_db)):
    if feedback.rating<1 or feedback.rating>5:
        return HTTPException(status_code=400,detail="Rating must be between 1 and 5")
    # print("rating",feedback.rating,"comment",feedback.comment)
    new_feedback=FeedbackModel(rating=feedback.rating,comment=feedback.comment)
    # print ("new feedback",new_feedback)
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return {"success": True, "feedback": new_feedback}

@app.get("/admin")
def get_all_feedbacks(
    db: Session = Depends(get_db),
    admin: str = Depends(verify_admin)
):
    feedbacks = db.query(FeedbackModel).all()
    return {"message":"successful in getting feedbacks","feedbacks":feedbacks}


