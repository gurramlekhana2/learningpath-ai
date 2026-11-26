from typing import Dict, Any, List
from app.services.skill_gap_service import skill_gap_service
from app.services.firecrawl_service import firecrawl_service

SIMULATION_ROLES = [
    {
        "role_name": "AI Engineer",
        "description": "Designs, builds, and deploys production-grade Generative AI, RAG, and agentic workflows.",
        "difficulty_rating": "Challenging",
        "market_demand_index": 98,
        "avg_salary_uplift": "+35%",
        "time_multiplier": 1.2
    },
    {
        "role_name": "Data Scientist",
        "description": "Applies statistical modeling, machine learning, and predictive analytics to enterprise datasets.",
        "difficulty_rating": "Moderate",
        "market_demand_index": 92,
        "avg_salary_uplift": "+25%",
        "time_multiplier": 1.0
    },
    {
        "role_name": "Cloud Engineer",
        "description": "Architects resilient, scalable cloud infrastructure, Kubernetes clusters, and automated CI/CD.",
        "difficulty_rating": "Moderate",
        "market_demand_index": 94,
        "avg_salary_uplift": "+26%",
        "time_multiplier": 1.0
    },
    {
        "role_name": "Full Stack Developer",
        "description": "Develops end-to-end web applications with modern frontend frameworks, APIs, and databases.",
        "difficulty_rating": "Accessible",
        "market_demand_index": 95,
        "avg_salary_uplift": "+20%",
        "time_multiplier": 0.8
    },
    {
        "role_name": "Cybersecurity Architect",
        "description": "Secures enterprise infrastructure with Zero Trust, threat modeling, and automated compliance.",
        "difficulty_rating": "Steep",
        "market_demand_index": 97,
        "avg_salary_uplift": "+38%",
        "time_multiplier": 1.5
    }
]

class CareerService:
    """AI Career Evolution Simulator."""

    async def simulate_career_paths(self, employee_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        current_role = employee_profile.get("current_role", "Software Developer")
        weekly_hours = employee_profile.get("weekly_hours_available", 5)

        results = []
        for role_meta in SIMULATION_ROLES:
            target_role = role_meta["role_name"]
            gap_analysis = await skill_gap_service.analyze_skill_gaps(employee_profile, target_role)
            role_intel = await firecrawl_service.get_role_intelligence(target_role)

            missing_skills = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Missing"]
            needs_improvement = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Needs Improvement"]
            proficient_skills = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Proficient"]

            est_hours = sum(g.estimated_hours_to_master for g in gap_analysis.gaps if g.gap_status != "Proficient")
            est_weeks = max(4, round((est_hours / max(weekly_hours, 1)) * role_meta["time_multiplier"]))

            # Readiness before vs projected after completion
            before_score = gap_analysis.readiness_score
            after_score = min(99.0, before_score + (100.0 - before_score) * 0.85)

            results.append({
                "target_role": target_role,
                "description": role_meta["description"],
                "transition_difficulty": role_meta["difficulty_rating"],
                "market_demand_index": role_meta["market_demand_index"],
                "avg_salary_uplift": role_meta["avg_salary_uplift"],
                "current_compatibility_score": before_score,
                "projected_readiness_score": round(after_score, 1),
                "estimated_learning_hours": est_hours,
                "estimated_weeks": est_weeks,
                "missing_skills": missing_skills,
                "skills_in_progress": needs_improvement,
                "already_acquired_skills": proficient_skills,
                "required_certifications": [c["name"] for c in role_intel.get("top_certifications", [])[:2]],
                "recommended_project": f"End-to-End Enterprise {target_role} Benchmark Application",
                "is_current_target": target_role.lower() == employee_profile.get("target_role", "").lower()
            })

        # Sort by compatibility score descending
        results.sort(key=lambda x: -x["current_compatibility_score"])
        return results

career_service = CareerService()
