from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class MementoMemoryType(str):
    COMPLETED_COURSE = "completed_course"
    ABANDONED_COURSE = "abandoned_course"
    SKILL_DEMONSTRATED = "skill_demonstrated"
    ROADMAP_VERSION = "roadmap_version"
    LEARNING_PREFERENCE = "learning_preference"
    ASSESSMENT_PERFORMANCE = "assessment_performance"
    CAREER_GOAL = "career_goal"

class MementoMemoryEntry(BaseModel):
    id: Optional[str] = None
    employee_id: str
    memory_type: str
    title: str
    content: str
    details: Dict[str, Any] = {}
    valid_from: datetime = Field(default_factory=datetime.utcnow)
    valid_to: Optional[datetime] = None
    confidence: float = 1.0  # 0.0 to 1.0
    source: str = "employee_action"  # employee_action, assessment, memento_agent, firecrawl_update
    applied_in_roadmap_version: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MemoryStoreRequest(BaseModel):
    memory_type: str
    title: str
    content: str
    details: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = 1.0
    source: Optional[str] = "manual_entry"

class MemoryQueryRequest(BaseModel):
    query: Optional[str] = None
    memory_type: Optional[str] = None
    limit: Optional[int] = 20
