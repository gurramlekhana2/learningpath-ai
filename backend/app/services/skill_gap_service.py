import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.models.skill import SkillGapItem, SkillGapAnalysis, GapStatus, GapPriority
from app.services.firecrawl_service import firecrawl_service
from app.services.memento_service import memento_service

ROLE_REQUIRED_SKILLS: Dict[str, List[Dict[str, Any]]] = {
    "AI Engineer": [
        {"name": "Python", "target_level": "Expert", "category": "Languages", "priority": GapPriority.CRITICAL, "demand": 98, "hours": 40},
        {"name": "LangChain & LlamaIndex", "target_level": "Advanced", "category": "GenAI Frameworks", "priority": GapPriority.CRITICAL, "demand": 96, "hours": 45},
        {"name": "Vector Databases (Pinecone/Milvus)", "target_level": "Advanced", "category": "Data", "priority": GapPriority.HIGH, "demand": 94, "hours": 30},
        {"name": "Model Fine-Tuning (LoRA / QLoRA)", "target_level": "Intermediate", "category": "Deep Learning", "priority": GapPriority.HIGH, "demand": 91, "hours": 50},
        {"name": "RAG Architecture & Evaluators", "target_level": "Advanced", "category": "Architecture", "priority": GapPriority.CRITICAL, "demand": 97, "hours": 40},
        {"name": "FastAPI & Async Backends", "target_level": "Advanced", "category": "Engineering", "priority": GapPriority.MEDIUM, "demand": 89, "hours": 25},
        {"name": "Docker & Containerization", "target_level": "Intermediate", "category": "DevOps", "priority": GapPriority.MEDIUM, "demand": 86, "hours": 20}
    ],
    "Data Scientist": [
        {"name": "Python", "target_level": "Expert", "category": "Languages", "priority": GapPriority.CRITICAL, "demand": 97, "hours": 35},
        {"name": "SQL & Data Modeling", "target_level": "Advanced", "category": "Databases", "priority": GapPriority.CRITICAL, "demand": 94, "hours": 30},
        {"name": "Machine Learning (Scikit-Learn)", "target_level": "Advanced", "category": "ML", "priority": GapPriority.HIGH, "demand": 92, "hours": 45},
        {"name": "PyTorch / TensorFlow", "target_level": "Intermediate", "category": "Deep Learning", "priority": GapPriority.HIGH, "demand": 88, "hours": 50},
        {"name": "Data Visualization & Storytelling", "target_level": "Advanced", "category": "Analytics", "priority": GapPriority.MEDIUM, "demand": 85, "hours": 20},
        {"name": "MLOps (MLflow, Feast)", "target_level": "Intermediate", "category": "MLOps", "priority": GapPriority.HIGH, "demand": 90, "hours": 35}
    ],
    "Full Stack Developer": [
        {"name": "JavaScript / TypeScript", "target_level": "Expert", "category": "Languages", "priority": GapPriority.CRITICAL, "demand": 98, "hours": 40},
        {"name": "React & Next.js", "target_level": "Advanced", "category": "Frontend", "priority": GapPriority.CRITICAL, "demand": 96, "hours": 45},
        {"name": "Node.js / Express / FastAPI", "target_level": "Advanced", "category": "Backend", "priority": GapPriority.HIGH, "demand": 92, "hours": 35},
        {"name": "PostgreSQL & Prisma / ORM", "target_level": "Advanced", "category": "Databases", "priority": GapPriority.HIGH, "demand": 90, "hours": 30},
        {"name": "REST & GraphQL APIs", "target_level": "Advanced", "category": "Architecture", "priority": GapPriority.MEDIUM, "demand": 88, "hours": 25},
        {"name": "CI/CD & Cloud Deployment", "target_level": "Intermediate", "category": "DevOps", "priority": GapPriority.MEDIUM, "demand": 85, "hours": 20}
    ],
    "Cloud Engineer": [
        {"name": "AWS / GCP Core Services", "target_level": "Expert", "category": "Cloud Platforms", "priority": GapPriority.CRITICAL, "demand": 98, "hours": 60},
        {"name": "Kubernetes & Containers", "target_level": "Advanced", "category": "Orchestration", "priority": GapPriority.CRITICAL, "demand": 96, "hours": 50},
        {"name": "Terraform / OpenTofu (IaC)", "target_level": "Advanced", "category": "Infrastructure", "priority": GapPriority.HIGH, "demand": 93, "hours": 35},
        {"name": "Linux Systems & Bash", "target_level": "Advanced", "category": "OS", "priority": GapPriority.HIGH, "demand": 90, "hours": 30},
        {"name": "Cloud Security & IAM", "target_level": "Advanced", "category": "Security", "priority": GapPriority.CRITICAL, "demand": 95, "hours": 40}
    ]
}

PROFICIENCY_WEIGHTS = {
    "None": 0,
    "Beginner": 25,
    "Intermediate": 60,
    "Advanced": 85,
    "Expert": 100
}

class SkillGapService:
    """Calculates granular skill gaps, readiness score, and learning priorities."""

    async def analyze_skill_gaps(self, employee_profile: Dict[str, Any], target_role: Optional[str] = None) -> SkillGapAnalysis:
        target = target_role or employee_profile.get("target_role", "AI Engineer")
        matched_target_role = "AI Engineer"
        for key in ROLE_REQUIRED_SKILLS:
            if key.lower() in target.lower() or target.lower() in key.lower():
                matched_target_role = key
                break

        required_skills = ROLE_REQUIRED_SKILLS[matched_target_role]
        employee_skills = employee_profile.get("skills", [])
        emp_skills_map = {s.get("name", "").strip().lower(): s for s in employee_skills}

        # Check Memento memory for completed courses or demonstrated skills
        employee_id = str(employee_profile.get("_id", employee_profile.get("id", "")))
        memory_summary = await memento_service.get_learning_history_summary(employee_id)
        demonstrated_map = {
            d.get("skill", "").strip().lower(): d for d in memory_summary.get("demonstrated_skills", [])
        }

        gap_items: List[SkillGapItem] = []
        total_score_sum = 0
        max_score_sum = len(required_skills) * 100
        missing_count = 0
        in_progress_count = 0
        proficient_count = 0

        # Fetch live industry learning resources from Firecrawl
        role_intel = await firecrawl_service.get_role_intelligence(matched_target_role)
        courses_pool = role_intel.get("learning_resources", [])

        learning_order = 1
        for req in required_skills:
            req_name = req["name"]
            req_lower = req_name.lower()
            target_level = req["target_level"]
            target_score = PROFICIENCY_WEIGHTS.get(target_level, 85)

            # Determine employee current level
            emp_level = "None"
            if req_lower in emp_skills_map:
                emp_level = emp_skills_map[req_lower].get("proficiency", "Beginner")
            elif req_lower in demonstrated_map:
                emp_level = demonstrated_map[req_lower].get("proficiency", "Intermediate")
            else:
                # Check fuzzy matching
                for k, v in emp_skills_map.items():
                    if k in req_lower or req_lower in k:
                        emp_level = v.get("proficiency", "Beginner")
                        break

            emp_score = PROFICIENCY_WEIGHTS.get(emp_level, 0)
            total_score_sum += min(emp_score, target_score)

            if emp_score == 0:
                gap_status = GapStatus.MISSING
                missing_count += 1
                rationale = f"Mandatory requirement for {matched_target_role}. You have no documented experience."
            elif emp_score < target_score:
                gap_status = GapStatus.NEEDS_IMPROVEMENT
                in_progress_count += 1
                rationale = f"Current proficiency ({emp_level}) needs advancement to {target_level} for production standards."
            else:
                gap_status = GapStatus.PROFICIENT
                proficient_count += 1
                rationale = f"Competency verified at {emp_level}. Meets or exceeds requirement."

            # Recommend tailored courses
            recommended = [
                c for c in courses_pool
                if req_lower in c.get("title", "").lower() or any(term in c.get("title", "").lower() for term in req_lower.split())
            ]
            if not recommended and courses_pool:
                recommended = [courses_pool[0]]

            gap_items.append(SkillGapItem(
                skill_name=req_name,
                category=req["category"],
                employee_level=emp_level,
                target_level=target_level,
                gap_status=gap_status,
                priority=req["priority"],
                industry_demand_score=req["demand"],
                learning_order=learning_order,
                rationale=rationale,
                estimated_hours_to_master=req["hours"],
                recommended_courses=recommended
            ))
            learning_order += 1

        # Sort gaps by priority: Critical first, then High, then Medium, then Low
        priority_order = {GapPriority.CRITICAL: 0, GapPriority.HIGH: 1, GapPriority.MEDIUM: 2, GapPriority.LOW: 3}
        gap_items.sort(key=lambda g: (priority_order.get(g.priority, 4), -g.industry_demand_score))
        for idx, item in enumerate(gap_items):
            item.learning_order = idx + 1

        readiness_score = round((total_score_sum / max(max_score_sum, 1)) * 100, 1)
        overall_skill_score = round((proficient_count * 100 + in_progress_count * 50) / max(len(required_skills), 1), 1)

        ai_insights = [
            f"You possess {proficient_count} of {len(required_skills)} core competencies for {matched_target_role}.",
            f"Immediate focus should be on {gap_items[0].skill_name} ({gap_items[0].priority.value} Priority) to achieve the largest career readiness jump.",
            f"Memento learning memory confirms prior experience with {len(employee_skills)} skills, enabling fast-tracked progression."
        ]

        analysis = SkillGapAnalysis(
            id=str(uuid.uuid4()),
            employee_id=employee_id,
            target_role=matched_target_role,
            current_role=employee_profile.get("current_role", "Software Developer"),
            readiness_score=readiness_score,
            overall_skill_score=overall_skill_score,
            missing_skills_count=missing_count,
            skills_in_progress_count=in_progress_count,
            proficient_skills_count=proficient_count,
            gaps=gap_items,
            ai_insights=ai_insights,
            created_at=datetime.utcnow()
        )
        return analysis

skill_gap_service = SkillGapService()
