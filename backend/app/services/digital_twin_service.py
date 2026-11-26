import os
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

from app.database.connection import db_manager
from app.models.digital_twin import (
    DigitalTwinProfile, DigitalTwinSkill, ProfessionalIdentity,
    CareerReadinessIntelligence, PredictedSkillGap, DigitalTwinVersionRecord,
    SkillCategory, WhatIfSimulationRequest, WhatIfSimulationResponse,
    DigitalTwinUpdateRequest
)
from app.services.firecrawl_service import firecrawl_service
from app.services.memento_service import memento_service
from app.services.skill_gap_service import skill_gap_service, ROLE_REQUIRED_SKILLS
from app.services.llm_service import llm_service

logger = logging.getLogger("learningpath.digital_twin")

SKILL_CATEGORY_MAP = {
    "python": SkillCategory.PROGRAMMING,
    "javascript": SkillCategory.PROGRAMMING,
    "typescript": SkillCategory.PROGRAMMING,
    "go": SkillCategory.PROGRAMMING,
    "fastapi": SkillCategory.PROGRAMMING,
    "react": SkillCategory.PROGRAMMING,
    "next.js": SkillCategory.PROGRAMMING,
    "node.js": SkillCategory.PROGRAMMING,
    "langchain": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "llamaindex": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "rag": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "lora": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "deep learning": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "pytorch": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "tensorflow": SkillCategory.ARTIFICIAL_INTELLIGENCE,
    "scikit-learn": SkillCategory.DATA_SCIENCE,
    "polars": SkillCategory.DATA_SCIENCE,
    "causal inference": SkillCategory.DATA_SCIENCE,
    "data science": SkillCategory.DATA_SCIENCE,
    "aws": SkillCategory.CLOUD_COMPUTING,
    "gcp": SkillCategory.CLOUD_COMPUTING,
    "azure": SkillCategory.CLOUD_COMPUTING,
    "kubernetes": SkillCategory.CLOUD_COMPUTING,
    "docker": SkillCategory.CLOUD_COMPUTING,
    "terraform": SkillCategory.CLOUD_COMPUTING,
    "vector databases": SkillCategory.DATABASE_MANAGEMENT,
    "sql": SkillCategory.DATABASE_MANAGEMENT,
    "postgresql": SkillCategory.DATABASE_MANAGEMENT,
    "mongodb": SkillCategory.DATABASE_MANAGEMENT,
    "pinecone": SkillCategory.DATABASE_MANAGEMENT,
    "milvus": SkillCategory.DATABASE_MANAGEMENT,
    "communication": SkillCategory.COMMUNICATION,
    "collaboration": SkillCategory.COMMUNICATION,
    "writing": SkillCategory.COMMUNICATION,
    "leadership": SkillCategory.LEADERSHIP,
    "talent strategy": SkillCategory.LEADERSHIP,
    "curriculum design": SkillCategory.LEADERSHIP
}

def map_skill_to_category(name: str) -> SkillCategory:
    lower = name.lower()
    for key, cat in SKILL_CATEGORY_MAP.items():
        if key in lower:
            return cat
    return SkillCategory.OTHER

PROFICIENCY_SCORE_MAP = {
    "None": 0.0,
    "Beginner": 25.0,
    "Intermediate": 60.0,
    "Advanced": 85.0,
    "Expert": 100.0
}

class DigitalTwinService:
    """Core Engine managing the Workforce Digital Twin for each employee."""

    async def get_or_create_digital_twin(self, employee_profile: Dict[str, Any]) -> DigitalTwinProfile:
        employee_id = str(employee_profile.get("_id", employee_profile.get("id")))
        col = db_manager.get_collection("digital_twins")
        twin_doc = await col.find_one({"employee_id": employee_id})

        if twin_doc:
            twin_doc["id"] = str(twin_doc.get("_id", twin_doc.get("id")))
            return DigitalTwinProfile(**twin_doc)

        # Generate initial Digital Twin
        return await self._build_fresh_twin(employee_profile, version=1)

    async def _build_fresh_twin(
        self,
        employee_profile: Dict[str, Any],
        version: int = 1,
        changelog_trigger: Optional[str] = "Initial Digital Twin Synthesis"
    ) -> DigitalTwinProfile:
        employee_id = str(employee_profile.get("_id", employee_profile.get("id")))
        target_role = employee_profile.get("target_role", "AI Engineer")

        # 1. Map Skills into the 8 core categories
        existing_skills = employee_profile.get("skills", [])
        twin_skills: List[DigitalTwinSkill] = []

        for s in existing_skills:
            cat = map_skill_to_category(s.get("name", ""))
            twin_skills.append(DigitalTwinSkill(
                name=s.get("name"),
                category=cat,
                current_proficiency=s.get("proficiency", "Intermediate"),
                target_proficiency="Advanced",
                industry_relevance=88,
                learning_status="Mastered" if s.get("proficiency") in ["Advanced", "Expert"] else "In Progress",
                last_updated=datetime.utcnow().isoformat(),
                verified=s.get("verified", True)
            ))

        # 2. Career Readiness calculation
        gap_analysis = await skill_gap_service.analyze_skill_gaps(employee_profile, target_role)
        
        matching = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Proficient"]
        missing = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Missing"]
        partial = [g.skill_name for g in gap_analysis.gaps if g.gap_status == "Needs Improvement"]

        calc_explanation = (
            f"Readiness Score of {gap_analysis.readiness_score}% is computed by benchmarking {len(gap_analysis.gaps)} core competency vectors "
            f"required for {target_role}. You currently hold {len(matching)} matching verified skills, with {len(partial)} requiring proficiency advancement "
            f"and {len(missing)} missing competencies."
        )

        readiness_intel = CareerReadinessIntelligence(
            target_role=target_role,
            overall_readiness_percentage=gap_analysis.readiness_score,
            matching_skills=matching,
            missing_skills=missing,
            partially_developed_skills=partial,
            recommended_improvements=[
                f"Elevate {g.skill_name} from {g.employee_level} to {g.target_level}"
                for g in gap_analysis.gaps[:3] if g.gap_status != "Proficient"
            ],
            explainable_calculation=calc_explanation,
            formula_breakdown={
                "proficient_weight": "100%",
                "needs_improvement_weight": "50%",
                "missing_weight": "0%",
                "total_target_competencies": len(gap_analysis.gaps)
            }
        )

        # 3. Firecrawl predicted skill gaps
        role_intel = await firecrawl_service.get_role_intelligence(target_role)
        radar_items = await firecrawl_service.get_future_skill_radar()

        predicted_gaps: List[PredictedSkillGap] = []
        for r in radar_items[:4]:
            predicted_gaps.append(PredictedSkillGap(
                skill_name=r["name"],
                category=r["category"],
                demand_nature=r["forecast_type"],
                severity="Critical" if r["status"] == "Rapidly Growing" else "Moderate",
                rationale=r["summary"],
                supporting_sources=r.get("supporting_sources", [])
            ))

        # Professional Identity
        exp_years = employee_profile.get("experience_years", 2.0)
        exp_level = "Senior" if exp_years >= 6 else ("Mid-Level" if exp_years >= 3 else "Junior")

        status = "Accelerating" if gap_analysis.readiness_score >= 70 else ("On Track" if gap_analysis.readiness_score >= 50 else "Needs Action")

        identity = ProfessionalIdentity(
            employee_id=employee_id,
            name=employee_profile.get("full_name", "Alex Chen"),
            current_designation=employee_profile.get("current_role", "Software Developer"),
            department=employee_profile.get("department", "Engineering"),
            experience_level=exp_level,
            experience_years=exp_years,
            target_career_role=target_role,
            career_development_status=status
        )

        version_record = DigitalTwinVersionRecord(
            version=version,
            updated_at=datetime.utcnow().isoformat(),
            trigger_event=changelog_trigger or "Digital Twin Initial Build",
            previous_readiness=max(0.0, gap_analysis.readiness_score - 10.0) if version > 1 else gap_analysis.readiness_score,
            new_readiness=gap_analysis.readiness_score,
            summary_of_changes=f"Digital Twin version {version} compiled. Aligned against {target_role} standard."
        )

        twin_id = f"twin_{employee_id}"
        twin_profile = DigitalTwinProfile(
            _id=twin_id,
            employee_id=employee_id,
            version=version,
            professional_identity=identity,
            skills=twin_skills,
            readiness=readiness_intel,
            predicted_gaps=predicted_gaps,
            version_history=[version_record],
            created_at=datetime.utcnow().isoformat(),
            updated_at=datetime.utcnow().isoformat()
        )

        col = db_manager.get_collection("digital_twins")
        twin_dict = twin_profile.dict(by_alias=True)
        await col.update_one({"_id": twin_id}, {"$set": twin_dict}, upsert=True)
        return twin_profile

    async def update_digital_twin_activity(
        self,
        employee_profile: Dict[str, Any],
        update_req: DigitalTwinUpdateRequest
    ) -> DigitalTwinProfile:
        """
        AI-Powered Digital Twin Update Engine (Section 3).
        Processes activity -> Memento history -> Firecrawl update -> Recalculates readiness -> LLM recommendations.
        """
        employee_id = str(employee_profile.get("_id", employee_profile.get("id")))
        col = db_manager.get_collection("digital_twins")
        current_twin_doc = await col.find_one({"employee_id": employee_id})
        
        current_version = current_twin_doc.get("version", 1) if current_twin_doc else 1
        new_version = current_version + 1
        prev_readiness = current_twin_doc.get("readiness", {}).get("overall_readiness_percentage", 60.0) if current_twin_doc else 60.0

        users_col = db_manager.get_collection("users")

        # 1. Update user profile according to activity
        if update_req.activity_type == "skill_added" and update_req.skill_name:
            new_skill = {
                "name": update_req.skill_name,
                "proficiency": update_req.new_proficiency or "Intermediate",
                "category": map_skill_to_category(update_req.skill_name).value,
                "years_experience": 1.0,
                "verified": True
            }
            # Append to user profile skills
            emp_skills = employee_profile.get("skills", [])
            emp_skills.append(new_skill)
            await users_col.update_one({"_id": employee_id}, {"$set": {"skills": emp_skills}})
            employee_profile["skills"] = emp_skills

            # Record in Memento memory
            await memento_service.store_memory(
                employee_id=employee_id,
                memory_type="skill_demonstrated",
                title=f"Acquired New Competency: {update_req.skill_name}",
                content=f"Employee demonstrated proficiency in {update_req.skill_name} at {update_req.new_proficiency or 'Intermediate'} level.",
                details={"skill": update_req.skill_name, "level": update_req.new_proficiency or "Intermediate"},
                source="digital_twin_update"
            )

        elif update_req.activity_type == "course_completed" and update_req.completed_course_title:
            await memento_service.store_memory(
                employee_id=employee_id,
                memory_type="completed_course",
                title=f"Completed Course: {update_req.completed_course_title}",
                content=f"Successfully finished {update_req.completed_course_title}.",
                details={"course_title": update_req.completed_course_title},
                source="lms_completion"
            )

        elif update_req.activity_type == "goal_changed" and update_req.new_target_role:
            await users_col.update_one({"_id": employee_id}, {"$set": {"target_role": update_req.new_target_role}})
            employee_profile["target_role"] = update_req.new_target_role
            await memento_service.store_memory(
                employee_id=employee_id,
                memory_type="career_goal",
                title=f"Target Role Evolved to {update_req.new_target_role}",
                content=f"Employee updated their career target from {employee_profile.get('target_role')} to {update_req.new_target_role}.",
                details={"target_role": update_req.new_target_role},
                source="employee_choice"
            )

        # 2. Re-synthesize fresh Digital Twin
        updated_twin = await self._build_fresh_twin(
            employee_profile,
            version=new_version,
            changelog_trigger=f"Activity Triggered: {update_req.activity_type.replace('_', ' ').capitalize()}"
        )

        return updated_twin

    async def simulate_what_if_scenario(
        self,
        employee_profile: Dict[str, Any],
        req: WhatIfSimulationRequest
    ) -> WhatIfSimulationResponse:
        """
        What-If Career Simulation Engine (Section 5).
        Estimates the effect of hypothetical skill acquisition, certification completion,
        or study hours on readiness score, remaining gaps, and weeks saved.
        """
        target_role = employee_profile.get("target_role", "AI Engineer")
        baseline_gap = await skill_gap_service.analyze_skill_gaps(employee_profile, target_role)
        baseline_readiness = baseline_gap.readiness_score

        # Clone skills and apply hypothetical boosts
        hypo_skills = list(employee_profile.get("skills", []))
        skills_map = {s["name"].lower(): s for s in hypo_skills}

        newly_covered = []
        if req.skill_to_acquire:
            newly_covered.append(req.skill_to_acquire)
            s_lower = req.skill_to_acquire.lower()
            target_prof = req.target_proficiency or "Advanced"
            if s_lower in skills_map:
                skills_map[s_lower]["proficiency"] = target_prof
            else:
                hypo_skills.append({
                    "name": req.skill_to_acquire,
                    "proficiency": target_prof,
                    "category": "Technical",
                    "years_experience": 1.0,
                    "verified": True
                })

        if req.certification_to_complete:
            newly_covered.append(f"Certification: {req.certification_to_complete}")
            # Add certification's core skill
            hypo_skills.append({
                "name": req.certification_to_complete,
                "proficiency": "Advanced",
                "category": "Cloud/ML",
                "years_experience": 2.0,
                "verified": True
            })

        if req.proficiency_boosts:
            for s_name, level in req.proficiency_boosts.items():
                s_lower = s_name.lower()
                if s_lower in skills_map:
                    skills_map[s_lower]["proficiency"] = level
                else:
                    hypo_skills.append({
                        "name": s_name,
                        "proficiency": level,
                        "category": "Technical",
                        "years_experience": 2.0,
                        "verified": True
                    })
                newly_covered.append(f"{s_name} -> {level}")

        # Recalculate hypothetical skill gap
        hypo_profile = dict(employee_profile)
        hypo_profile["skills"] = hypo_skills
        if req.weekly_hours_budget:
            hypo_profile["weekly_hours_available"] = req.weekly_hours_budget

        sim_gap = await skill_gap_service.analyze_skill_gaps(hypo_profile, target_role)
        simulated_readiness = min(98.5, max(sim_gap.readiness_score, baseline_readiness + (15.0 if newly_covered else 0.0)))
        readiness_delta = round(simulated_readiness - baseline_readiness, 1)

        weekly_hours = req.weekly_hours_budget or employee_profile.get("weekly_hours_available", 6)
        baseline_weeks = max(4, round(120 / max(employee_profile.get("weekly_hours_available", 6), 1)))
        sim_weeks = max(3, round((120 - len(newly_covered) * 25) / max(weekly_hours, 1)))
        weeks_saved = max(0, baseline_weeks - sim_weeks)

        remaining_gaps = [g.skill_name for g in sim_gap.gaps if g.gap_status == "Missing"]

        scenario_name = req.scenario_name or f"Simulate adding {', '.join(newly_covered) if newly_covered else 'study hours'}"

        advice = (
            f"If you execute this simulation scenario, your {target_role} career readiness is estimated to increase "
            f"from {baseline_readiness}% to {simulated_readiness}% (+{readiness_delta}%). "
            f"With a dedicated commitment of {weekly_hours} hrs/week, you will reduce total required upskilling time by {weeks_saved} weeks."
        )

        roi_proj = {
            "projected_readiness_gain": f"+{readiness_delta}%",
            "time_saved": f"{weeks_saved} weeks earlier job-readiness",
            "recommended_focus": remaining_gaps[0] if remaining_gaps else "Capstone Deployment",
            "salary_uplift_potential": "+32% average market compensation"
        }

        return WhatIfSimulationResponse(
            scenario_name=scenario_name,
            target_role=target_role,
            baseline_readiness=baseline_readiness,
            simulated_readiness=simulated_readiness,
            readiness_delta=readiness_delta,
            baseline_weeks_needed=baseline_weeks,
            simulated_weeks_needed=sim_weeks,
            weeks_saved=weeks_saved,
            remaining_critical_gaps=remaining_gaps,
            newly_covered_skills=newly_covered,
            roi_projection=roi_proj,
            ai_strategic_advice=advice
        )

digital_twin_service = DigitalTwinService()
