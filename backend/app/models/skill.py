from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class GapPriority(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class GapStatus(str, Enum):
    MISSING = "Missing"
    NEEDS_IMPROVEMENT = "Needs Improvement"
    PROFICIENT = "Proficient"

class SkillGapItem(BaseModel):
    skill_name: str
    category: str = "Technical"
    employee_level: str = "None"
    target_level: str = "Advanced"
    gap_status: GapStatus = GapStatus.MISSING
    priority: GapPriority = GapPriority.HIGH
    industry_demand_score: int = Field(default=85, ge=0, le=100)
    learning_order: int = 1
    rationale: str = ""
    estimated_hours_to_master: int = 40
    recommended_courses: List[Dict[str, Any]] = []

class SkillGapAnalysis(BaseModel):
    id: Optional[str] = None
    employee_id: str
    target_role: str
    current_role: str
    readiness_score: float = 65.0  # 0 to 100
    overall_skill_score: float = 70.0
    missing_skills_count: int = 0
    skills_in_progress_count: int = 0
    proficient_skills_count: int = 0
    gaps: List[SkillGapItem] = []
    ai_insights: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SkillObsolescenceAlert(BaseModel):
    skill_name: str
    category: str
    current_status: str = "Declining"
    market_drop_percentage: float = 32.5
    replacement_skills: List[str] = []
    evidence_sources: List[Dict[str, str]] = []
    recommendation: str = ""

class FutureRadarSkill(BaseModel):
    name: str
    category: str
    growth_rate: float
    demand_level: str  # Emerging, Rapidly Growing, Highly Demanded, Declining
    market_relevance: float  # 0 - 100
    industry_sources_count: int
    summary: str
    verified_sources: List[Dict[str, str]] = []
