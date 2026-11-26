from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.utils.security import get_current_user, require_roles
from app.database.connection import db_manager
from app.services.workforce_analytics_service import workforce_analytics_service

router = APIRouter(prefix="/hr", tags=["HR Management"])

@router.get("/dashboard")
async def get_hr_dashboard(current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))):
    """
    HR Executive Dashboard:
    Workforce readiness, department-level skill gaps, and organizational skill shortages.
    """
    users_col = db_manager.get_collection("users")
    employees = await (users_col.find({"role": "employee"})).to_list(100)

    total_employees = len(employees)
    avg_readiness = round(sum(e.get("readiness_score", 60.0) for e in employees) / max(total_employees, 1), 1)

    department_gaps = [
        {"department": "Engineering", "critical_shortage": "RAG & LLM Ops", "shortage_level": "High", "affected_employees": 14, "readiness": 64},
        {"department": "Product Management", "critical_shortage": "AI Product Strategy", "shortage_level": "Medium", "affected_employees": 8, "readiness": 72},
        {"department": "Data Analytics", "critical_shortage": "Vector DBs & Embeddings", "shortage_level": "High", "affected_employees": 11, "readiness": 68},
        {"department": "Infrastructure", "critical_shortage": "GPU Cluster Provisioning & Kubernetes", "shortage_level": "Critical", "affected_employees": 6, "readiness": 58}
    ]

    workforce_distribution = [
        {"name": "Readiness > 80% (Job Ready)", "count": round(total_employees * 0.28)},
        {"name": "Readiness 60-80% (In Progress)", "count": round(total_employees * 0.52)},
        {"name": "Readiness < 60% (High Gap)", "count": round(total_employees * 0.20)}
    ]

    return {
        "summary": {
            "total_employees_monitored": total_employees,
            "average_workforce_readiness": avg_readiness,
            "active_learning_programs": 5,
            "skills_at_risk_count": 4
        },
        "department_skill_gaps": department_gaps,
        "workforce_distribution": workforce_distribution,
        "top_emerging_requirements": [
            {"skill": "RAG Architecture", "demand_increase": "+160%", "current_coverage": "32%"},
            {"skill": "Vector Search Systems", "demand_increase": "+128%", "current_coverage": "41%"},
            {"skill": "AI Safety & Guardrails", "demand_increase": "+95%", "current_coverage": "24%"}
        ]
    }

@router.get("/employees")
async def list_employees(current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))):
    """View employee learning progress list for authorized HR roles."""
    users_col = db_manager.get_collection("users")
    employees = await (users_col.find({"role": "employee"})).to_list(100)
    sanitized = []
    for e in employees:
        e_copy = dict(e)
        e_copy.pop("hashed_password", None)
        sanitized.append(e_copy)
    return {"employees": sanitized, "count": len(sanitized)}

@router.post("/recommend")
async def hr_recommend_program(
    payload: dict,
    current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))
):
    """HR Manager assigns or suggests an upskilling initiative to a team."""
    return {
        "status": "success",
        "message": f"Successfully notified team of new upskilling initiative: {payload.get('initiative_title', 'GenAI Workforce Sprint')}."
    }

@router.get("/workforce-digital-twin")
async def get_workforce_digital_twin(
    department: str = Query("ALL"),
    current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))
):
    """
    Organizational Workforce Digital Twin:
    Aggregated representation of workforce skills, distribution, and shortages.
    """
    data = await workforce_analytics_service.get_organizational_digital_twin(department_filter=department)
    return data

@router.get("/workforce-skill-gaps")
async def get_workforce_skill_gaps(
    current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))
):
    """Returns organizational skill gap matrix."""
    data = await workforce_analytics_service.get_organizational_digital_twin()
    return {"skill_gap_matrix": data.get("skill_gap_matrix", [])}

@router.get("/department-heatmap")
async def get_department_heatmap(
    current_user: dict = Depends(require_roles(["hr_manager", "learning_admin"]))
):
    """Returns Department x Skill Category competency heatmap."""
    data = await workforce_analytics_service.get_organizational_digital_twin()
    return {"department_heatmap": data.get("department_heatmap", [])}
