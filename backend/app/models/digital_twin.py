from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class SkillCategory(str, Enum):
    PROGRAMMING = "Programming"
    ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence"
    DATA_SCIENCE = "Data Science"
    CLOUD_COMPUTING = "Cloud Computing"
    DATABASE_MANAGEMENT = "Database Management"
    COMMUNICATION = "Communication"
    LEADERSHIP = "Leadership"
    OTHER = "Other Professional Skills"

class DigitalTwinSkill(BaseModel):
    name: str
    category: SkillCategory = SkillCategory.PROGRAMMING
    current_proficiency: str = "Beginner"  # Beginner, Intermediate, Advanced, Expert
    target_proficiency: str = "Advanced"
    industry_relevance: int = Field(default=85, ge=0, le=100)
    learning_status: str = "In Progress"  # Mastered, In Progress, Planned, Not Started
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    verified: bool = False

class ProfessionalIdentity(BaseModel):
    employee_id: str
    name: str
    current_designation: str
    department: str
    experience_level: str  # Junior, Mid-Level, Senior, Lead
    experience_years: float = 2.0
    target_career_role: str
    career_development_status: str = "On Track"  # Accelerating, On Track, Steady, Needs Action

class CareerReadinessIntelligence(BaseModel):
    target_role: str
    overall_readiness_percentage: float = 65.0
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    partially_developed_skills: List[str] = []
    recommended_improvements: List[str] = []
    explainable_calculation: str = ""
    formula_breakdown: Dict[str, Any] = {}

class PredictedSkillGap(BaseModel):
    skill_name: str
    category: str
    demand_nature: str  # Observed Industry Demand vs Estimated Future Requirement
    severity: str  # Critical, High, Moderate
    rationale: str
    supporting_sources: List[Dict[str, str]] = []

class DigitalTwinVersionRecord(BaseModel):
    version: int
    updated_at: str
    trigger_event: str
    previous_readiness: float
    new_readiness: float
    summary_of_changes: str

class DigitalTwinProfile(BaseModel):
    id: str = Field(..., alias="_id")
    employee_id: str
    version: int = 1
    professional_identity: ProfessionalIdentity
    skills: List[DigitalTwinSkill] = []
    readiness: CareerReadinessIntelligence
    predicted_gaps: List[PredictedSkillGap] = []
    version_history: List[DigitalTwinVersionRecord] = []
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    class Config:
        populate_by_name = True

class DigitalTwinUpdateRequest(BaseModel):
    activity_type: str  # course_completed, skill_added, proficiency_improved, goal_changed, recommendation_received
    skill_name: Optional[str] = None
    new_proficiency: Optional[str] = None
    completed_course_title: Optional[str] = None
    new_target_role: Optional[str] = None
    notes: Optional[str] = ""

class WhatIfSimulationRequest(BaseModel):
    skill_to_acquire: Optional[str] = None
    target_proficiency: Optional[str] = "Advanced"
    certification_to_complete: Optional[str] = None
    proficiency_boosts: Optional[Dict[str, str]] = None  # e.g. {"Python": "Expert"}
    weekly_hours_budget: Optional[int] = None
    scenario_name: Optional[str] = "Custom Career Experiment"

class WhatIfSimulationResponse(BaseModel):
    scenario_name: str
    target_role: str
    baseline_readiness: float
    simulated_readiness: float
    readiness_delta: float
    baseline_weeks_needed: int
    simulated_weeks_needed: int
    weeks_saved: int
    remaining_critical_gaps: List[str]
    newly_covered_skills: List[str]
    roi_projection: Dict[str, Any]
    ai_strategic_advice: str
