from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from app.api.dependencies import get_current_active_user, get_database
from app.schemas.user import UserInDB
from app.schemas.resume import RoadmapRequest, RoadmapResponse
from app.services.gemini_client import gemini_client
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import json

router = APIRouter()

@router.post("/roadmap", response_model=RoadmapResponse)
async def generate_roadmap(
    request: RoadmapRequest,
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)]
):
    prompt = f"""
    Analyze the following resume text for a candidate targeting the role of '{request.target_role}'.
    
    Resume Text:
    {request.resume_text}
    
    Goal:
    Generate a personalized career roadmap and analysis.
    
    Please provide the output in strict JSON format with the following structure:
    {{
      "career_summary": "A brief summary of the candidate's current standing and potential.",
      "missing_skills": ["List of missing or weak skills"],
      "roadmap": [
        {{
          "month": "Month 1-2",
          "focus": "Main focus area",
          "tasks": ["Task 1", "Task 2"]
        }},
        {{
            "month": "Month 3-4",
            "focus": "...",
            "tasks": ["..."]
        }},
        {{
            "month": "Month 5-6",
            "focus": "...",
            "tasks": ["..."]
        }}
      ],
      "project_ideas": [
        {{
          "title": "Project Title",
          "description": "Brief description",
          "tech_stack": ["Tech 1", "Tech 2"]
        }}
      ],
      "job_readiness_score": 75
    }}
    
    The response MUST be valid JSON only. Do not include markdown formatting like ```json ... ``` unless it is the only way to format it, but prefer raw JSON if possible.
    """
    
    system_instruction = "You are an expert career coach and technical interviewer. Output ONLY valid JSON."
    
    try:
        content = await gemini_client.generate_content(prompt, system_instruction=system_instruction)
        if not content:
             raise Exception("Empty response from AI provider")
        
        # Clean up markdown code blocks if present
        clean_content = content.strip()
        if clean_content.startswith("```json"):
            clean_content = clean_content[7:]
        if clean_content.startswith("```"):
            clean_content = clean_content[3:]
        if clean_content.endswith("```"):
            clean_content = clean_content[:-3]
            
        roadmap_json = json.loads(clean_content)
        
        doc = {
            "user_id": str(current_user.id),
            "target_role": request.target_role,
            "roadmap_json": roadmap_json,
            "created_at": datetime.utcnow()
        }
        
        new_roadmap = await db.ai_roadmaps.insert_one(doc)
        created_roadmap = await db.ai_roadmaps.find_one({"_id": new_roadmap.inserted_id})
        
        return RoadmapResponse(**created_roadmap)
        
    except json.JSONDecodeError:
        print(f"AI JSON Error: Content was {content}")
        raise HTTPException(status_code=502, detail="AI output parsing failed. Please try again.")
    except Exception as e:
        print(f"CRITICAL GEMINI ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        
        with open("critical_error.log", "a") as f:
            f.write(f"AI Generation Error: {e}\n{traceback.format_exc()}\n{'-'*30}\n")
        
        # Return graceful error as requested
        raise HTTPException(status_code=503, detail=f"AI service temporarily unavailable: {str(e)}")
