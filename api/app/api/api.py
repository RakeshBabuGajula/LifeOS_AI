from fastapi import APIRouter
from app.api.endpoints import auth, users, dashboard, career, skill_gap, burnout, resume, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(career.router, prefix="/career", tags=["career"])
api_router.include_router(skill_gap.router, prefix="/skill-gap", tags=["skill-gap"])
api_router.include_router(burnout.router, prefix="/burnout", tags=["burnout"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
