from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.security import get_current_user
from app.models.digital_twin import (
    DigitalTwinUpdateRequest, WhatIfSimulationRequest, DigitalTwinProfile
)
from app.services.digital_twin_service import digital_twin_service
from app.services.memento_service import memento_service

router = APIRouter(prefix="/digital-twin", tags=["Workforce Digital Twin"])

@router.get("/profile", response_model=DigitalTwinProfile)
async def get_digital_twin_profile(current_user: dict = Depends(get_current_user)):
    """Retrieve or dynamically synthesize the employee's Workforce Digital Twin."""
    twin = await digital_twin_service.get_or_create_digital_twin(current_user)
    return twin

@router.get("/skills")
async def get_digital_twin_skills(current_user: dict = Depends(get_current_user)):
    """Retrieve categorized skill intelligence map across 8 professional domains."""
    twin = await digital_twin_service.get_or_create_digital_twin(current_user)
    return {
        "employee_id": twin.employee_id,
        "skills": twin.skills,
        "total_skills": len(twin.skills)
    }

@router.get("/history")
async def get_digital_twin_history(current_user: dict = Depends(get_current_user)):
    """
    Retrieve genuine Memento learning memory timeline and Digital Twin version evolution.
    """
    employee_id = current_user["id"]
    twin = await digital_twin_service.get_or_create_digital_twin(current_user)
    memory_summary = await memento_service.get_learning_history_summary(employee_id)
    memories = await memento_service.retrieve_memories(employee_id, limit=30)

    return {
        "version_history": twin.version_history,
        "current_version": twin.version,
        "memento_memories": memories,
        "memory_summary": memory_summary
    }

@router.get("/readiness")
async def get_digital_twin_readiness(current_user: dict = Depends(get_current_user)):
    """Retrieve explainable Career Readiness Intelligence with calculation breakdown."""
    twin = await digital_twin_service.get_or_create_digital_twin(current_user)
    return twin.readiness

@router.post("/update", response_model=DigitalTwinProfile)
async def update_digital_twin(
    req: DigitalTwinUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-Powered Digital Twin Update Engine.
    Processes employee activity -> Memento history -> Firecrawl update -> Re-evaluates readiness -> LLM recommendations.
    """
    updated_twin = await digital_twin_service.update_digital_twin_activity(current_user, req)
    return updated_twin

@router.post("/simulate")
async def simulate_what_if_scenario(
    req: WhatIfSimulationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    What-If Career Simulation.
    Estimates the impact of acquiring a skill, earning a certification, or dedicating hours
    on career readiness, timeline reduction, and remaining gaps.
    """
    simulation_result = await digital_twin_service.simulate_what_if_scenario(current_user, req)
    return simulation_result
