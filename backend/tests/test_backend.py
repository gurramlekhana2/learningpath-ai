import pytest
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.services.firecrawl_service import firecrawl_service
from app.services.memento_service import memento_service
from app.services.skill_gap_service import skill_gap_service
from app.services.career_service import career_service
from app.utils.security import create_access_token

client = TestClient(app)

@pytest.fixture(scope="session")
def ensure_db_lifespan():
    with TestClient(app) as test_client:
        yield test_client

def test_health_endpoint(ensure_db_lifespan):
    response = ensure_db_lifespan.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database_mode" in data

def test_auth_login_demo_employee(ensure_db_lifespan):
    response = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["full_name"] == "Alex Chen"
    assert data["user"]["role"] == "employee"

def test_auth_login_invalid_password(ensure_db_lifespan):
    response = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "wrong_password"}
    )
    assert response.status_code == 401

def test_auth_register_new_employee(ensure_db_lifespan):
    import uuid
    random_email = f"user_{uuid.uuid4().hex[:6]}@enterprise.com"
    response = ensure_db_lifespan.post(
        "/api/auth/register",
        json={
            "email": random_email,
            "password": "securepass123",
            "full_name": "Jordan Smith",
            "role": "employee",
            "department": "Engineering",
            "current_role": "Backend Engineer"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == random_email

def test_employee_profile_and_skill_gap(ensure_db_lifespan):
    # Login as Alex
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Profile
    prof_resp = ensure_db_lifespan.get("/api/employees/profile", headers=headers)
    assert prof_resp.status_code == 200
    assert prof_resp.json()["full_name"] == "Alex Chen"

    # Skill Gap analysis
    gap_resp = ensure_db_lifespan.post("/api/skills/analyze?target_role=AI%20Engineer", headers=headers)
    assert gap_resp.status_code == 200
    gap_data = gap_resp.json()
    assert "readiness_score" in gap_data
    assert len(gap_data["gaps"]) > 0
    assert gap_data["target_role"] == "AI Engineer"

def test_firecrawl_industry_intelligence(ensure_db_lifespan):
    resp = ensure_db_lifespan.get("/api/industry/trends?role=AI%20Engineer")
    assert resp.status_code == 200
    data = resp.json()
    assert "trending_skills" in data
    assert len(data["trending_skills"]) > 0

    # Test obsolescence and radar
    obs_resp = ensure_db_lifespan.get("/api/skills/obsolescence")
    assert obs_resp.status_code == 200
    assert len(obs_resp.json()["alerts"]) > 0

    radar_resp = ensure_db_lifespan.get("/api/skills/radar")
    assert radar_resp.status_code == 200
    assert len(radar_resp.json()["radar"]) > 0

def test_memento_memory_operations(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get history
    mem_resp = ensure_db_lifespan.get("/api/memory/history", headers=headers)
    assert mem_resp.status_code == 200
    data = mem_resp.json()
    assert data["count"] >= 3
    assert "summary" in data

    # Store a new memory
    store_resp = ensure_db_lifespan.post(
        "/api/memory/store",
        json={
            "memory_type": "skill_demonstrated",
            "title": "Built Microservice in Go",
            "content": "Demonstrated low-latency API handling in Golang.",
            "details": {"benchmark_ms": 1.2}
        },
        headers=headers
    )
    assert store_resp.status_code == 200
    assert store_resp.json()["title"] == "Built Microservice in Go"

def test_roadmap_flow_and_evolution(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Current roadmap
    rm_resp = ensure_db_lifespan.get("/api/roadmap/current", headers=headers)
    assert rm_resp.status_code == 200
    rm = rm_resp.json()
    assert "weekly_milestones" in rm
    assert len(rm["weekly_milestones"]) > 0

    # Update progress
    update_resp = ensure_db_lifespan.put(
        "/api/roadmap/progress",
        json={
            "roadmap_id": rm["id"],
            "week_number": 1,
            "status": "completed"
        },
        headers=headers
    )
    assert update_resp.status_code == 200
    updated_rm = update_resp.json()
    assert updated_rm["progress_percentage"] > 0

    # Evolution Diff
    diff_resp = ensure_db_lifespan.get("/api/roadmap/evolution", headers=headers)
    assert diff_resp.status_code == 200
    diff = diff_resp.json()
    assert "reasoning_summary" in diff

def test_career_simulator(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sim_resp = ensure_db_lifespan.get("/api/career/simulate", headers=headers)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert sim_data["count"] >= 4
    roles = [s["target_role"] for s in sim_data["simulations"]]
    assert "AI Engineer" in roles

def test_ai_mentor_chatbot(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chat_resp = ensure_db_lifespan.post(
        "/api/chat",
        json={"message": "What should I learn next to improve my readiness?"},
        headers=headers
    )
    assert chat_resp.status_code == 200
    reply = chat_resp.json()
    assert "reply" in reply
    assert len(reply["reply"]) > 20

def test_hr_role_based_access_control(ensure_db_lifespan):
    # Employee cannot access HR dashboard
    emp_login = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    emp_token = emp_login.json()["access_token"]
    denied = ensure_db_lifespan.get("/api/hr/dashboard", headers={"Authorization": f"Bearer {emp_token}"})
    assert denied.status_code == 403

    # HR Manager can access HR dashboard
    hr_login = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "sarah.hr@enterprise.com", "password": "password123"}
    )
    hr_token = hr_login.json()["access_token"]
    allowed = ensure_db_lifespan.get("/api/hr/dashboard", headers={"Authorization": f"Bearer {hr_token}"})
    assert allowed.status_code == 200
    hr_data = allowed.json()
    assert "department_skill_gaps" in hr_data

def test_digital_twin_lifecycle(ensure_db_lifespan):
    # 1. Login as Alex
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. GET /profile
    twin_resp = ensure_db_lifespan.get("/api/digital-twin/profile", headers=headers)
    assert twin_resp.status_code == 200
    twin = twin_resp.json()
    assert twin["professional_identity"]["name"] == "Alex Chen"
    assert "skills" in twin
    assert "readiness" in twin
    assert twin["version"] >= 1

    # 3. GET /skills
    skills_resp = ensure_db_lifespan.get("/api/digital-twin/skills", headers=headers)
    assert skills_resp.status_code == 200
    assert skills_resp.json()["total_skills"] > 0

    # 4. GET /history
    hist_resp = ensure_db_lifespan.get("/api/digital-twin/history", headers=headers)
    assert hist_resp.status_code == 200
    hist = hist_resp.json()
    assert "version_history" in hist
    assert "memento_memories" in hist

    # 5. GET /readiness
    ready_resp = ensure_db_lifespan.get("/api/digital-twin/readiness", headers=headers)
    assert ready_resp.status_code == 200
    ready = ready_resp.json()
    assert "overall_readiness_percentage" in ready
    assert "explainable_calculation" in ready

def test_digital_twin_update_engine(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Post an activity update
    update_resp = ensure_db_lifespan.post(
        "/api/digital-twin/update",
        json={
            "activity_type": "skill_added",
            "skill_name": "LangGraph Agentic Workflows",
            "new_proficiency": "Advanced"
        },
        headers=headers
    )
    assert update_resp.status_code == 200
    updated = update_resp.json()
    assert updated["version"] >= 2
    # Verify skill appears in skills list
    skill_names = [s["name"] for s in updated["skills"]]
    assert any("LangGraph" in s for s in skill_names)

def test_what_if_career_simulation(ensure_db_lifespan):
    login_resp = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "alex.chen@enterprise.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sim_resp = ensure_db_lifespan.post(
        "/api/digital-twin/simulate",
        json={
            "skill_to_acquire": "Kubernetes",
            "target_proficiency": "Advanced",
            "certification_to_complete": "CKA - Certified Kubernetes Administrator",
            "weekly_hours_budget": 12,
            "scenario_name": "What-If CKA Sprint"
        },
        headers=headers
    )
    assert sim_resp.status_code == 200
    res = sim_resp.json()
    assert res["target_role"] == "AI Engineer"
    assert res["simulated_readiness"] >= res["baseline_readiness"]
    assert "weeks_saved" in res
    assert "ai_strategic_advice" in res

def test_hr_workforce_digital_twin(ensure_db_lifespan):
    # HR Login
    hr_login = ensure_db_lifespan.post(
        "/api/auth/login",
        json={"email": "sarah.hr@enterprise.com", "password": "password123"}
    )
    token = hr_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Workforce Digital Twin
    wf_resp = ensure_db_lifespan.get("/api/hr/workforce-digital-twin?department=ALL", headers=headers)
    assert wf_resp.status_code == 200
    wf = wf_resp.json()
    assert "summary" in wf
    assert "skill_distribution" in wf
    assert "department_heatmap" in wf
    assert "skill_gap_matrix" in wf

    # Heatmap endpoint
    hm_resp = ensure_db_lifespan.get("/api/hr/department-heatmap", headers=headers)
    assert hm_resp.status_code == 200
    assert len(hm_resp.json()["department_heatmap"]) >= 4

    # Gaps endpoint
    gaps_resp = ensure_db_lifespan.get("/api/hr/workforce-skill-gaps", headers=headers)
    assert gaps_resp.status_code == 200
    assert len(gaps_resp.json()["skill_gap_matrix"]) >= 4
