from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    EMPLOYEE = "employee"
    HR_MANAGER = "hr_manager"
    LEARNING_ADMIN = "learning_admin"

class SkillProficiency(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class SkillItem(BaseModel):
    name: str
    proficiency: SkillProficiency = SkillProficiency.BEGINNER
    category: str = "Technical"
    years_experience: float = 1.0
    verified: bool = False

class EmployeeRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.EMPLOYEE
    department: Optional[str] = "Engineering"
    current_role: Optional[str] = "Software Developer"

class EmployeeLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class OnboardingRequest(BaseModel):
    department: str
    current_role: str
    experience_years: float
    skills: List[SkillItem]
    soft_skills: List[str] = []
    career_interests: List[str] = []
    target_role: str
    weekly_hours_available: int = 5

class EmployeeProfile(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.EMPLOYEE
    department: str = "Engineering"
    current_role: str = "Software Developer"
    experience_years: float = 2.0
    skills: List[SkillItem] = []
    soft_skills: List[str] = []
    career_interests: List[str] = []
    target_role: str = "AI Engineer"
    weekly_hours_available: int = 5
    readiness_score: float = 65.0
    onboarding_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
