from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_active_user
from app.schemas.user import UserInDB
from app.db.mongo import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any, List

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Fetch latest Career Roadmap
    career_cursor = db.career_roadmaps.find({"user_id": current_user.id}).sort("created_at", -1).limit(1)
    latest_career = await career_cursor.to_list(length=1)
    
    # Fetch latest Skill Gap
    skill_cursor = db.skill_gap_reports.find({"user_id": current_user.id}).sort("created_at", -1).limit(1)
    latest_skill = await skill_cursor.to_list(length=1)
    
    # Fetch latest Burnout Log
    # Burnout logs use 'user_id' as string in previous implementation, verify consistency
    # users.id is usually ObjectId object or string depending on UserInDB. 
    # In burnout.py: "user_id": str(current_user.id)
    # So we search by str(current_user.id)
    burnout_cursor = db.burnout_logs.find({"user_id": str(current_user.id)}).sort("created_at", -1).limit(1)
    latest_burnout = await burnout_cursor.to_list(length=1)

    # Process Stats
    stats = {
        "career_gps": "Not Started",
        "skill_gap": "Analysis Pending",
        "burnout_monitor": "Calibrating..."
    }
    
    widgets = {
        "career": None,
        "skill": None,
        "burnout": None
    }

    if latest_career:
        widgets["career"] = {
            "title": latest_career[0].get("target_role", "Career Path"),
            "date": latest_career[0].get("created_at"), # Ensure datetime is serializable or convert to isoformat in frontend
            "details": f"{len(latest_career[0].get('roadmap', []))} Milestones"
        }
        stats["career_gps"] = "Active"

    if latest_skill:
        report = latest_skill[0].get("report", {})
        score = report.get("match_percentage", 0)
        widgets["skill"] = {
            "score": f"{score}% Match",
            "role": latest_skill[0].get("target_role", "Target Role"),
            "date": latest_skill[0].get("created_at")
        }
        stats["skill_gap"] = f"{score}% Ready"

    if latest_burnout:
        score = latest_burnout[0].get("burnout_risk_score", 0)
        level = latest_burnout[0].get("risk_level", "Low")
        widgets["burnout"] = {
            "score": score,
            "level": level,
            "date": latest_burnout[0].get("created_at")
        }
        stats["burnout_monitor"] = f"{level} Risk"

    return {
        "welcome_message": f"Welcome back, {current_user.full_name or current_user.email}!",
        "stats": stats,
        "widgets": widgets,
        "modules": [
            {
                "name": "Career GPS",
                "status": "active",
                "description": "Navigate your career path using AI-driven insights."
            },
            {
                "name": "Skill Gap Predictor",
                "status": "active",
                "description": "Identify and bridge skill gaps for your dream role."
            },
            {
                "name": "Burnout Monitor",
                "status": "active",
                "description": "Monitor your work-life balance and prevent burnout."
            },
            {
                "name": "Resume Intelligence",
                "status": "active",
                "description": "AI-powered resume analysis and career roadmap generation."
            }
        ]
    }

@router.get("/insights")
async def get_dashboard_insights(
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Fetch data again for specialized insights feed
    skill_cursor = db.skill_gap_reports.find({"user_id": current_user.id}).sort("created_at", -1).limit(1)
    latest_skill = await skill_cursor.to_list(length=1)
    
    burnout_cursor = db.burnout_logs.find({"user_id": str(current_user.id)}).sort("created_at", -1).limit(1)
    latest_burnout = await burnout_cursor.to_list(length=1)
    
    feed = []
    
    # Generate insights based on data
    if latest_skill:
        report = latest_skill[0].get("report", {})
        score = report.get("match_percentage", 0)
        missing = report.get("missing_skills", [])
        if missing:
             feed.append({
                "type": "skill",
                "title": "Skill Recommendation",
                "message": f"Learning {missing[0]} could increase your match score significantly.",
                "action": "View Course",
                "link": "/dashboard/skill-gap"
            })
        feed.append({
            "type": "career",
            "title": "Role Readiness",
            "message": f"You are {score}% ready for {latest_skill[0].get('target_role', 'your target role')}.",
            "action": "See Gap Analysis",
            "link": "/dashboard/skill-gap"
        })
        
    if latest_burnout:
        level = latest_burnout[0].get("risk_level", "Low")
        actions = latest_burnout[0].get("recommended_actions", [])
        if actions:
             feed.append({
                "type": "wellness",
                "title": "Wellness Check",
                "message": actions[0],
                "action": "Log Check-in",
                "link": "/dashboard/burnout"
            })
        if level == "High":
             feed.append({
                "type": "alert",
                "title": "High Burnout Risk",
                "message": "Your recent logs indicate high stress. Consider a break.",
                "action": "View Trends",
                "link": "/dashboard/burnout"
            })

    # Default if empty
    if not feed:
        feed.append({
             "type": "info",
             "title": "Getting Started",
             "message": "Complete the modules to get personalized AI insights here.",
             "action": "Explore Modules",
             "link": "/dashboard"
        })
        
    return {
        "today_insight": feed[0] if feed else None,
        "feed": feed
    }
