from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from app.api.dependencies import get_current_active_user
from app.db.mongo import get_database
from app.schemas.burnout import BurnoutCheckinCreate, BurnoutLog, BurnoutRiskAnalysis
from app.schemas.user import UserInDB
from motor.motor_asyncio import AsyncIOMotorDatabase
import uuid

router = APIRouter()

@router.post("/checkin", response_model=BurnoutLog)
async def checkin_burnout(
    checkin: BurnoutCheckinCreate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Rule-based Logic
    # 1. Stress (1-10): Higher is worse. Contribution up to 50 points.
    stress_points = checkin.stress * 5
    
    # 2. Mood (1-5): Lower is worse. Contribution up to 30 points.
    # 5->0, 4->7.5, 3->15, 2->22.5, 1->30
    mood_points = (6 - checkin.mood) * 6
    
    # 3. Sleep (Poor/Average/Good). Contribution up to 20 points.
    sleep_points = 0
    if checkin.sleep_quality == "Poor":
        sleep_points = 20
    elif checkin.sleep_quality == "Average":
        sleep_points = 10
    
    # 4. Work Hours (Overwork penalty). Contribution +10 if > 10, +20 if > 12.
    work_penalty = 0
    if checkin.work_hours > 12:
        work_penalty = 20
    elif checkin.work_hours > 10:
        work_penalty = 10
        
    total_score = stress_points + mood_points + sleep_points + work_penalty
    total_score = min(100, max(0, total_score)) # Clamp 0-100
    
    # Risk Level
    if total_score < 40:
        risk_level = "Low"
    elif total_score < 75:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    # Generate Insights & Actions
    insights = []
    actions = []
    
    if checkin.stress >= 8:
        insights.append("Stress levels are critically high.")
        actions.append("Consider taking a short break immediately.")
    if checkin.mood <= 2:
        insights.append("Your mood indicates significant emotional strain.")
        actions.append("Schedule a chat with a mentor or friend.")
    if checkin.sleep_quality == "Poor":
        insights.append("Lack of quality sleep is a major burnout factor.")
        actions.append("Try to sleep 30 minutes earlier tonight.")
    if checkin.work_hours > 10:
        insights.append(f"Working {checkin.work_hours} hours increases cognitive load significantly.")
        actions.append("Set a hard stop for work today.")
        
    if not insights:
        insights.append("You are maintaining a healthy balance.")
    if not actions:
        actions.append("Keep up the good routines!")
        
    # Analysis Object
    analysis = BurnoutRiskAnalysis(
        burnout_risk_score=int(total_score),
        risk_level=risk_level,
        insights=insights,
        recommended_actions=actions
    )
    
    # Save to MongoDB
    log_entry = {
        "id": str(uuid.uuid4()),
        "user_id": str(current_user.id), # Check if ID is string or ObjectId, usually str in UserInDB
        "created_at": datetime.utcnow(),
        **checkin.model_dump(),
        **analysis.model_dump()
    }
    
    await db["burnout_logs"].insert_one(log_entry)
    
    return log_entry

@router.get("/history", response_model=List[BurnoutLog])
async def get_burnout_history(
    limit: int = 7,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db["burnout_logs"].find({"user_id": str(current_user.id)}).sort("created_at", -1).limit(limit)
    history = await cursor.to_list(length=limit)
    return history
