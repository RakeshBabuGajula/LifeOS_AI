from pydantic import BaseModel, Field, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime

# Helper for ObjectId to string conversion
PyObjectId = Annotated[str, BeforeValidator(str)]

class SkillGapInput(BaseModel):
    skills: List[str]
    target_role: str
    level: str

class SkillGapReport(BaseModel):
    job_readiness_score: int
    missing_skills: List[str]
    priority_learning_steps: List[str]
    recommended_projects: List[str]
    estimated_time_months: int

class SkillGapInDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[PyObjectId] = None
    skills: List[str]
    target_role: str
    level: str
    report: SkillGapReport
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
