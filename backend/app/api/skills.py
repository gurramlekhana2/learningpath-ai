from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.utils.security import get_current_user
from app.services.skill_gap_service import skill_gap_service
from app.services.firecrawl_service import firecrawl_service

router = APIRouter(prefix="/skills", tags=["Skills Intelligence"])

@router.post("/analyze")
async def analyze_skills(target_role: Optional[str] = Query(None), current_user: dict = Depends(get_current_user)):
    """Run dynamic skill gap analysis against employee's profile and target role."""
    analysis = await skill_gap_service.analyze_skill_gaps(current_user, target_role=target_role)
    return analysis

@router.get("/gaps")
async def get_current_gaps(current_user: dict = Depends(get_current_user)):
    """Retrieve current gaps."""
    analysis = await skill_gap_service.analyze_skill_gaps(current_user)
    return analysis

@router.get("/obsolescence")
async def get_skill_obsolescence():
    """Skill Obsolescence Alert differentiator."""
    alerts = await firecrawl_service.get_obsolescence_alerts()
    return {"alerts": alerts, "count": len(alerts)}

@router.get("/radar")
async def get_future_skill_radar():
    """Future Skill Radar differentiator."""
    radar_data = await firecrawl_service.get_future_skill_radar()
    return {"radar": radar_data, "count": len(radar_data)}
