from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SleepQuality(str, Enum):
    POOR = "Poor"
    AVERAGE = "Average"
    GOOD = "Good"

class BurnoutCheckinCreate(BaseModel):
    mood: int = Field(..., ge=1, le=5, description="Mood score from 1-5")
    stress: int = Field(..., ge=1, le=10, description="Stress level from 1-10")
    work_hours: float = Field(..., ge=0, description="Hours worked today")
    sleep_quality: SleepQuality
    notes: Optional[str] = None

class BurnoutRiskAnalysis(BaseModel):
    burnout_risk_score: int
    risk_level: str  # Low, Medium, High
    insights: List[str]
    recommended_actions: List[str]

class BurnoutLog(BurnoutCheckinCreate, BurnoutRiskAnalysis):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
