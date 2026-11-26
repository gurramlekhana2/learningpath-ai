from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class MilestoneStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    SKIPPED = "skipped"

class CourseResource(BaseModel):
    title: str
    provider: str
    difficulty: str = "Intermediate"
    duration_hours: int = 15
    cost_usd: float = 0.0
    url: str
    verified_by_firecrawl: bool = True

class PracticalProject(BaseModel):
    title: str
    description: str
    deliverables: List[str] = []
    github_starter_url: Optional[str] = None

class WeeklyMilestone(BaseModel):
    week_number: int
    title: str
    focus_skill: str
    status: MilestoneStatus = MilestoneStatus.PENDING
    objectives: List[str]
    courses: List[CourseResource] = []
    practical_project: Optional[PracticalProject] = None
    assessment_checkpoint: str
    completed_at: Optional[datetime] = None

class CertificationItem(BaseModel):
    name: str
    issuing_organization: str
    relevance_score: int = 90
    difficulty: str = "Advanced"
    url: str
    recommended_at_week: int = 8

class LearningRoadmap(BaseModel):
    id: Optional[str] = None
    employee_id: str
    target_role: str
    title: str
    version: int = 1
    status: str = "active"  # active, paused, completed
    estimated_duration_weeks: int = 12
    total_estimated_hours: int = 80
    difficulty: str = "Intermediate to Advanced"
    progress_percentage: float = 0.0
    weekly_milestones: List[WeeklyMilestone] = []
    certifications: List[CertificationItem] = []
    learning_roi: Dict[str, Any] = {}
    memento_memory_influences: List[str] = []
    firecrawl_evidence_sources: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RoadmapDiffComparison(BaseModel):
    previous_version: int
    current_version: int
    target_role: str
    completed_skills_count: int
    newly_added_skills: List[str]
    removed_or_superseded_skills: List[str]
    reasoning_summary: str
    comparison_details: List[Dict[str, Any]]
