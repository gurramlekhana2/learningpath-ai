from fastapi import APIRouter, Depends
from app.utils.security import get_current_user
from app.services.career_service import career_service

router = APIRouter(prefix="/career", tags=["Career Simulator"])

@router.get("/simulate")
async def simulate_career_transitions(current_user: dict = Depends(get_current_user)):
    """
    AI Career Evolution Simulator.
    Calculates skill compatibility, missing competencies, estimated learning time,
    and before-and-after readiness across multiple future target roles.
    """
    simulations = await career_service.simulate_career_paths(current_user)
    return {
        "current_role": current_user.get("current_role", "Software Developer"),
        "simulations": simulations,
        "count": len(simulations)
    }
