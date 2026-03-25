from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, List, Dict, Any, Annotated
from datetime import datetime

# Helper for ObjectId to string conversion
PyObjectId = Annotated[str, BeforeValidator(str)]

# Resume Schemas
class ResumeBase(BaseModel):
    extracted_text: str
    detected_skills: List[str] = []

class ResumeCreate(ResumeBase):
    pass

class ResumeInDB(ResumeBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class ResumeResponse(ResumeBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

# AI Roadmap Schemas
class RoadmapRequest(BaseModel):
    resume_text: str
    target_role: str

class RoadmapBase(BaseModel):
    target_role: str
    roadmap_json: Dict[str, Any]

class RoadmapInDB(RoadmapBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class RoadmapResponse(RoadmapBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
