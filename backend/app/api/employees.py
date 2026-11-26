from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.security import get_current_user
from app.database.connection import db_manager
from app.models.employee import OnboardingRequest
from app.services.roadmap_service import roadmap_service
from app.services.memento_service import memento_service

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_copy = dict(current_user)
    user_copy.pop("hashed_password", None)
    return user_copy

@router.put("/profile")
async def update_profile(updates: dict, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    user_id = current_user["id"]

    # Filter disallowed updates
    disallowed = ["_id", "id", "hashed_password", "role"]
    clean_updates = {k: v for k, v in updates.items() if k not in disallowed}
    clean_updates["updated_at"] = datetime.utcnow().isoformat()

    await users_col.update_one({"_id": user_id}, {"$set": clean_updates})
    updated_user = await users_col.find_one({"_id": user_id})
    updated_user.pop("hashed_password", None)
    return updated_user

@router.post("/onboarding")
async def complete_onboarding(req: OnboardingRequest, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    user_id = current_user["id"]

    skills_dicts = [s.dict() for s in req.skills]
    update_data = {
        "department": req.department,
        "current_role": req.current_role,
        "experience_years": req.experience_years,
        "skills": skills_dicts,
        "soft_skills": req.soft_skills,
        "career_interests": req.career_interests,
        "target_role": req.target_role,
        "weekly_hours_available": req.weekly_hours_available,
        "onboarding_completed": True,
        "updated_at": datetime.utcnow().isoformat()
    }

    await users_col.update_one({"_id": user_id}, {"$set": update_data})
    fresh_user = await users_col.find_one({"_id": user_id})

    # Save initial onboarding memory in Memento
    await memento_service.store_memory(
        employee_id=user_id,
        memory_type="learning_preference",
        title="Completed Onboarding Profile",
        content=f"Employee aims for {req.target_role} with {req.weekly_hours_available} hrs/week availability.",
        details={"interests": req.career_interests, "target": req.target_role},
        source="onboarding_wizard"
    )

    # Automatically generate initial roadmap
    initial_roadmap = await roadmap_service.generate_roadmap(fresh_user, target_role=req.target_role)

    fresh_user.pop("hashed_password", None)
    return {
        "profile": fresh_user,
        "initial_roadmap": initial_roadmap
    }
