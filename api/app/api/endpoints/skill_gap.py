from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api import dependencies
from app.db.mongo import get_database
from app.schemas.skill_gap import SkillGapInput, SkillGapReport, SkillGapInDB
from app.schemas.user import UserInDB
from app.services.skill_engine import SkillGapEngine

router = APIRouter()

@router.post("/analyze", response_model=SkillGapReport)
async def analyze_skill_gap(
    input_data: SkillGapInput,
    current_user: UserInDB = Depends(dependencies.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Analyze skill gap based on user profile and target role.
    result is stored in database.
    """
    
    # 1. Run AI Analysis Engine
    report_data = SkillGapEngine.analyze(
        skills=input_data.skills,
        target_role=input_data.target_role,
        level=input_data.level
    )
    
    # 2. Store in Database
    skill_gap_record = SkillGapInDB(
        user_id=current_user.id,
        skills=input_data.skills,
        target_role=input_data.target_role,
        level=input_data.level,
        report=report_data
    )
    
    record_dict = skill_gap_record.model_dump(by_alias=True, exclude={"id"})
    await db.skill_gap_reports.insert_one(record_dict)
    
    return SkillGapReport(**report_data)

@router.get("/history", response_model=List[SkillGapInDB])
async def get_skill_gap_history(
    current_user: UserInDB = Depends(dependencies.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get the last 5 skill gap reports for the current user.
    """
    cursor = db.skill_gap_reports.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).limit(5)
    
    history = await cursor.to_list(length=5)
    return [SkillGapInDB(**doc) for doc in history]
