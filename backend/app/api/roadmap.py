from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.utils.security import get_current_user
from app.database.connection import db_manager
from app.services.roadmap_service import roadmap_service
from pydantic import BaseModel

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

class ProgressUpdateRequest(BaseModel):
    roadmap_id: str
    week_number: int
    status: str  # pending, in_progress, completed, paused

@router.post("/generate")
async def generate_roadmap(
    target_role: Optional[str] = Query(None),
    force_new: bool = Query(False),
    current_user: dict = Depends(get_current_user)
):
    """Generate or evolve personalized learning roadmap."""
    roadmap = await roadmap_service.generate_roadmap(
        current_user,
        target_role=target_role,
        force_new_version=force_new
    )
    return roadmap

@router.get("/current")
async def get_current_roadmap(current_user: dict = Depends(get_current_user)):
    """Get active roadmap for current employee."""
    user_id = current_user["id"]
    rm = await roadmap_service.get_current_roadmap(user_id)
    if not rm:
        # If no roadmap exists yet, auto generate one
        rm = await roadmap_service.generate_roadmap(current_user)
    return rm

@router.put("/progress")
async def update_roadmap_progress(
    req: ProgressUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update status of a roadmap milestone."""
    updated = await roadmap_service.update_milestone_progress(
        employee_id=current_user["id"],
        roadmap_id=req.roadmap_id,
        week_number=req.week_number,
        new_status=req.status
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milestone or roadmap not found."
        )
    return updated

@router.get("/history")
async def get_roadmap_history(current_user: dict = Depends(get_current_user)):
    """Get all past and present roadmap versions."""
    col = db_manager.get_collection("roadmaps")
    history = await (await col.find({"employee_id": current_user["id"]}, sort=[("version", -1)])).to_list(20)
    return {"versions": history, "count": len(history)}

@router.get("/evolution")
async def get_roadmap_evolution(
    target_role: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Roadmap Evolution Tracker: compare previous and updated roadmaps side-by-side."""
    diff = await roadmap_service.compare_roadmap_versions(
        employee_id=current_user["id"],
        target_role=target_role
    )
    return diff
