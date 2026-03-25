from app.schemas.user import PyObjectId
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class CareerRecommendRequest(BaseModel):
    skills: List[str]
    interest: str
    level: str
    target_role: str

class CareerRoadmapResponse(BaseModel):
    career_path: str
    skill_gaps: List[str]
    next_steps: List[str]
    suggested_projects: List[str]
    timeline_months: int

class CareerRoadmapInDB(CareerRoadmapResponse):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    skills: List[str]
    interest: str
    level: str
    target_role: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        from_attributes = True
