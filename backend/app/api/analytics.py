from fastapi import APIRouter, Depends
from app.utils.security import get_current_user
from app.services.skill_gap_service import skill_gap_service
from app.services.roadmap_service import roadmap_service
from app.services.firecrawl_service import firecrawl_service
from app.services.memento_service import memento_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    target_role = current_user.get("target_role", "AI Engineer")

    # 1. Skill Gap Analysis
    gap_analysis = await skill_gap_service.analyze_skill_gaps(current_user, target_role)

    # 2. Active Roadmap
    roadmap = await roadmap_service.get_current_roadmap(user_id)
    if not roadmap:
        roadmap = await roadmap_service.generate_roadmap(current_user, target_role)

    # 3. Industry trending skills from Firecrawl
    role_intel = await firecrawl_service.get_role_intelligence(target_role)

    # 4. Memento learning memory summary
    memory_summary = await memento_service.get_learning_history_summary(user_id)

    # Next recommended action
    pending_milestones = [m for m in roadmap.weekly_milestones if m.status != "completed"]
    next_milestone = pending_milestones[0] if pending_milestones else None

    recommended_action = {
        "title": f"Complete Week {next_milestone.week_number}: {next_milestone.focus_skill}" if next_milestone else "Review Latest Industry Trends",
        "description": next_milestone.objectives[0] if next_milestone and next_milestone.objectives else "You have completed all current milestones. Review the Future Skill Radar to stay ahead.",
        "estimated_hours": next_milestone.courses[0].duration_hours if next_milestone and next_milestone.courses else 5,
        "type": "learning_milestone" if next_milestone else "exploration"
    }

    return {
        "employee_profile": {
            "name": current_user.get("full_name"),
            "current_role": current_user.get("current_role"),
            "target_role": target_role,
            "department": current_user.get("department")
        },
        "career_readiness_score": gap_analysis.readiness_score,
        "overall_skill_score": gap_analysis.overall_skill_score,
        "missing_skills_count": gap_analysis.missing_skills_count,
        "skills_in_progress_count": gap_analysis.skills_in_progress_count,
        "proficient_skills_count": gap_analysis.proficient_skills_count,
        "active_roadmap": {
            "id": roadmap.id,
            "title": roadmap.title,
            "version": roadmap.version,
            "progress_percentage": roadmap.progress_percentage,
            "status": roadmap.status,
            "total_milestones": len(roadmap.weekly_milestones),
            "completed_milestones": sum(1 for m in roadmap.weekly_milestones if m.status == "completed")
        },
        "recommended_next_action": recommended_action,
        "emerging_industry_skills": role_intel.get("trending_skills", [])[:4],
        "recent_ai_insights": gap_analysis.ai_insights,
        "memento_memory_count": memory_summary.get("total_memories", 0),
        "upcoming_milestones": [
            {
                "week_number": m.week_number,
                "title": m.title,
                "focus_skill": m.focus_skill,
                "status": m.status
            }
            for m in pending_milestones[:3]
        ]
    }

@router.get("/progress")
async def get_progress_data(current_user: dict = Depends(get_current_user)):
    """Provides structured data for Recharts visual analytics."""
    readiness_trajectory = [
        {"period": "Week 1", "readiness": 38, "industry_benchmark": 45},
        {"period": "Week 2", "readiness": 44, "industry_benchmark": 48},
        {"period": "Week 3", "readiness": 51, "industry_benchmark": 52},
        {"period": "Week 4", "readiness": 58, "industry_benchmark": 55},
        {"period": "Current", "readiness": current_user.get("readiness_score", 65), "industry_benchmark": 60},
        {"period": "Target (Projected)", "readiness": 95, "industry_benchmark": 85}
    ]

    skill_radar_distribution = [
        {"category": "GenAI & LLMs", "employeeScore": 75, "targetRequired": 95, "fullMark": 100},
        {"category": "Vector DBs", "employeeScore": 60, "targetRequired": 90, "fullMark": 100},
        {"category": "RAG Systems", "employeeScore": 70, "targetRequired": 95, "fullMark": 100},
        {"category": "Cloud & DevOps", "employeeScore": 85, "targetRequired": 85, "fullMark": 100},
        {"category": "FastAPI Backends", "employeeScore": 80, "targetRequired": 90, "fullMark": 100},
        {"category": "Model Fine-Tuning", "employeeScore": 45, "targetRequired": 85, "fullMark": 100}
    ]

    weekly_activity_hours = [
        {"day": "Mon", "hours": 1.5, "focus": "Vector DBs"},
        {"day": "Tue", "hours": 2.0, "focus": "RAG Testing"},
        {"day": "Wed", "hours": 0.5, "focus": "Documentation"},
        {"day": "Thu", "hours": 2.5, "focus": "Hands-on Project"},
        {"day": "Fri", "hours": 1.0, "focus": "Assessment"},
        {"day": "Sat", "hours": 3.0, "focus": "LoRA Tuning Lab"},
        {"day": "Sun", "hours": 0.0, "focus": "Rest"}
    ]

    return {
        "readiness_trajectory": readiness_trajectory,
        "skill_radar_distribution": skill_radar_distribution,
        "weekly_activity_hours": weekly_activity_hours,
        "learning_consistency_percentage": 84.0,
        "certifications_completed": 2,
        "certifications_in_progress": 1
    }
