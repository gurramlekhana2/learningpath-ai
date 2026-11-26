import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.config import settings
from app.database.connection import db_manager
from app.utils.security import get_password_hash

# Import API Routers
from app.api.auth import router as auth_router
from app.api.employees import router as employees_router
from app.api.skills import router as skills_router
from app.api.roadmap import router as roadmap_router
from app.api.industry import router as industry_router
from app.api.memory import router as memory_router
from app.api.chatbot import router as chatbot_router
from app.api.analytics import router as analytics_router
from app.api.hr import router as hr_router
from app.api.career import router as career_router
from app.api.digital_twin import router as digital_twin_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("learningpath.main")

async def seed_demo_data():
    """Seeds realistic demonstration accounts and Memento memories."""
    users_col = db_manager.get_collection("users")
    count = await users_col.count_documents()
    if count > 0:
        logger.info(f"Database already populated ({count} users). Skipping seed.")
        return

    logger.info("Seeding initial enterprise demo accounts and learning history...")

    # 1. Standard Employee: Alex Chen
    emp_id = "emp_alex_chen_001"
    alex_user = {
        "_id": emp_id,
        "id": emp_id,
        "email": "alex.chen@enterprise.com",
        "hashed_password": get_password_hash("password123"),
        "full_name": "Alex Chen",
        "role": "employee",
        "department": "Engineering",
        "current_role": "Junior Software Developer",
        "experience_years": 2.5,
        "skills": [
            {"name": "Python", "proficiency": "Intermediate", "category": "Languages", "years_experience": 2.5, "verified": True},
            {"name": "FastAPI", "proficiency": "Intermediate", "category": "Frameworks", "years_experience": 1.5, "verified": True},
            {"name": "Docker & Containerization", "proficiency": "Intermediate", "category": "DevOps", "years_experience": 1.0, "verified": True},
            {"name": "Git", "proficiency": "Advanced", "category": "Tools", "years_experience": 3.0, "verified": True}
        ],
        "soft_skills": ["Critical Thinking", "Agile Collaboration", "Technical Writing"],
        "career_interests": ["Generative AI", "Agentic Systems", "Cloud Infrastructure"],
        "target_role": "AI Engineer",
        "weekly_hours_available": 8,
        "readiness_score": 62.5,
        "onboarding_completed": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    await users_col.insert_one(alex_user)

    # 2. HR Manager: Sarah Jenkins
    hr_id = "hr_sarah_jenkins_001"
    sarah_user = {
        "_id": hr_id,
        "id": hr_id,
        "email": "sarah.hr@enterprise.com",
        "hashed_password": get_password_hash("password123"),
        "full_name": "Sarah Jenkins",
        "role": "hr_manager",
        "department": "Human Resources & Talent",
        "current_role": "Director of Workforce Development",
        "experience_years": 8.0,
        "skills": [
            {"name": "Talent Strategy", "proficiency": "Expert", "category": "Management", "years_experience": 8.0, "verified": True},
            {"name": "Organizational Development", "proficiency": "Expert", "category": "Management", "years_experience": 7.0, "verified": True}
        ],
        "soft_skills": ["Executive Leadership", "Conflict Resolution", "Strategic Planning"],
        "career_interests": ["Workforce Upskilling", "AI Talent Analytics"],
        "target_role": "VP of Talent Intelligence",
        "weekly_hours_available": 5,
        "readiness_score": 92.0,
        "onboarding_completed": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    await users_col.insert_one(sarah_user)

    # 3. Learning Administrator: David Kim
    admin_id = "admin_david_kim_001"
    david_user = {
        "_id": admin_id,
        "id": admin_id,
        "email": "david.admin@enterprise.com",
        "hashed_password": get_password_hash("password123"),
        "full_name": "David Kim",
        "role": "learning_admin",
        "department": "Learning & Development",
        "current_role": "Enterprise L&D Administrator",
        "experience_years": 6.0,
        "skills": [
            {"name": "Curriculum Design", "proficiency": "Expert", "category": "L&D", "years_experience": 6.0, "verified": True},
            {"name": "LMS Management", "proficiency": "Expert", "category": "Operations", "years_experience": 5.0, "verified": True}
        ],
        "soft_skills": ["Program Management", "Instructional Design"],
        "career_interests": ["Adaptive Learning Tech", "AI Mentorship Platforms"],
        "target_role": "Head of Enterprise Education",
        "weekly_hours_available": 10,
        "readiness_score": 95.0,
        "onboarding_completed": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    await users_col.insert_one(david_user)

    # 4. Seed initial Memento memories for Alex Chen
    from app.services.memento_service import memento_service
    await memento_service.store_memory(
        employee_id=emp_id,
        memory_type="completed_course",
        title="Completed: Python Object-Oriented Programming & AsyncIO",
        content="Finished 20-hour intensive course on Python asynchronous patterns and concurrency.",
        details={"provider": "Coursera / DeepLearning.AI", "score": 95, "completed_year": 2026},
        source="course_verification",
        confidence=1.0
    )
    await memento_service.store_memory(
        employee_id=emp_id,
        memory_type="abandoned_course",
        title="Abandoned: Pure Theoretical Linear Algebra for ML",
        content="Discontinued after module 2 because content lacked applied Python coding exercises.",
        details={"reason": "Pacing too theoretical; prefers hands-on code labs", "drop_week": 2},
        source="lms_telemetry",
        confidence=0.9
    )
    await memento_service.store_memory(
        employee_id=emp_id,
        memory_type="skill_demonstrated",
        title="Verified Skill: Docker Containerization",
        content="Successfully containerized a multi-service FastAPI microservice with health checks.",
        details={"skill": "Docker & Containerization", "proficiency": "Intermediate"},
        source="peer_review",
        confidence=1.0
    )
    await memento_service.store_memory(
        employee_id=emp_id,
        memory_type="learning_preference",
        title="Preference: Hands-on Project Labs",
        content="Alex learns best with practical GitHub repositories and guided capstone deliverables rather than multiple-choice quizzes.",
        details={"format": "project_based", "preferred_session_length": 90},
        source="onboarding_wizard",
        confidence=0.95
    )

    # 5. Generate initial roadmap for Alex Chen
    from app.services.roadmap_service import roadmap_service
    await roadmap_service.generate_roadmap(alex_user, target_role="AI Engineer")
    logger.info("Demo data seeding completed successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing LearningPath AI Engine...")
    await db_manager.connect()
    await seed_demo_data()
    yield
    # Shutdown
    logger.info("Shutting down LearningPath AI Engine...")
    await db_manager.close()

app = FastAPI(
    title="LearningPath AI – Workforce Upskilling Engine",
    description="Adaptive AI Platform fusing Firecrawl Web Intelligence, Memento Persistent Memory, and LLMs.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Vite frontend & sandboxed proxies
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api")
app.include_router(employees_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(roadmap_router, prefix="/api")
app.include_router(industry_router, prefix="/api")
app.include_router(memory_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(hr_router, prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(digital_twin_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "LearningPath AI Backend",
        "timestamp": datetime.utcnow().isoformat(),
        "database_mode": "MongoDB" if not db_manager.is_fallback else "Persistent DocumentDB",
        "firecrawl_live_connected": bool(settings.FIRECRAWL_API_KEY),
        "memento_storage_mode": settings.MEMENTO_STORAGE_MODE,
        "llm_cloud_connected": bool(settings.OPENAI_API_KEY or settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
