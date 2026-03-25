from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import Annotated, Optional
import pdfplumber
import io
from app.api.dependencies import get_current_active_user, get_database
from app.schemas.user import UserInDB
from app.schemas.resume import ResumeResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

router = APIRouter()

@router.post("/analyze", response_model=ResumeResponse)
async def analyze_resume(
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    extracted_text = ""
    if file:
        if file.content_type == "application/pdf":
            content = await file.read()
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                extracted_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        else:
             # Assume text file if not PDF
             content = await file.read()
             extracted_text = content.decode("utf-8", errors="ignore")
    elif text:
        extracted_text = text
    else:
        raise HTTPException(status_code=400, detail="No resume provided")

    resume_doc = {
        "user_id": str(current_user.id),
        "extracted_text": extracted_text,
        "detected_skills": [], # Placeholder for future skill extraction
        "created_at": datetime.utcnow()
    }
    
    new_resume = await db.resumes.insert_one(resume_doc)
    created_resume = await db.resumes.find_one({"_id": new_resume.inserted_id})
    
    return ResumeResponse(**created_resume)
