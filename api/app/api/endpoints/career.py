from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api import dependencies
from app.db.mongo import get_database
from app.schemas.career import CareerRecommendRequest, CareerRoadmapResponse, CareerRoadmapInDB
from app.schemas.user import UserInDB
from app.services.career_engine import CareerEngine

router = APIRouter()

@router.post("/recommend", response_model=CareerRoadmapResponse)
async def generate_career_recommendation(
    request: CareerRecommendRequest,
    current_user: UserInDB = Depends(dependencies.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Generate AI-powered career roadmap.
    Stores the result in the database.
    """
    # 1. Generate Roadmap Logic
    roadmap_data = CareerEngine.generate(
        skills=request.skills,
        interest=request.interest,
        level=request.level,
        target_role=request.target_role
    )
    
    # 2. Save to Database
    # Create Pydantic model for DB to ensure validation and correct types
    roadmap_in_db = CareerRoadmapInDB(
        user_id=current_user.id,
        skills=request.skills,
        interest=request.interest,
        level=request.level,
        target_role=request.target_role,
        **roadmap_data
    )
    
    # Convert to dict for MongoDB, excluding None id (Mongo generates it)
    roadmap_dict = roadmap_in_db.model_dump(by_alias=True, exclude={"id"})
    
    await db.career_roadmaps.insert_one(roadmap_dict)
    
    return CareerRoadmapResponse(**roadmap_data)
