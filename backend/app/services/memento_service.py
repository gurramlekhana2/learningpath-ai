import os
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import httpx

from app.config import settings
from app.database.connection import db_manager
from app.models.learning_history import MementoMemoryEntry, MementoMemoryType

logger = logging.getLogger("learningpath.memento")

class MementoMemoryService:
    """
    Memento Persistent Memory Adapter.
    Adheres to the official bitemporal agent memory paradigm (tracking valid time vs transaction time,
    episodic knowledge, course completion, abandoned efforts, and evolving employee preferences).
    Supports external Mem0 / Memento REST APIs if configured, with resilient local bitemporal persistence.
    """

    def __init__(self):
        self.api_key = settings.MEMENTO_API_KEY
        self.api_url = settings.MEMENTO_API_URL
        self.storage_mode = settings.MEMENTO_STORAGE_MODE

    async def store_memory(
        self,
        employee_id: str,
        memory_type: str,
        title: str,
        content: str,
        details: Optional[Dict[str, Any]] = None,
        source: str = "employee_action",
        confidence: float = 1.0,
        applied_in_roadmap_version: Optional[int] = None
    ) -> Dict[str, Any]:
        """Store persistent memory entry with bitemporal metadata."""
        memory_id = str(uuid.uuid4())
        entry = {
            "_id": memory_id,
            "id": memory_id,
            "employee_id": employee_id,
            "memory_type": memory_type,
            "title": title,
            "content": content,
            "details": details or {},
            "valid_from": datetime.utcnow().isoformat(),
            "valid_to": None,
            "confidence": confidence,
            "source": source,
            "applied_in_roadmap_version": applied_in_roadmap_version,
            "created_at": datetime.utcnow().isoformat()
        }

        # If external Mem0 API key is set, sync to remote cloud memory
        if self.api_key and self.storage_mode in ["mem0_cloud", "bitemporal_hybrid"]:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.post(
                        f"{self.api_url}/memories/",
                        headers={"Authorization": f"Token {self.api_key}"},
                        json={
                            "messages": [{"role": "user", "content": f"[{memory_type}] {title}: {content}"}],
                            "user_id": employee_id,
                            "metadata": {"type": memory_type, "source": source}
                        }
                    )
            except Exception as e:
                logger.warning(f"Could not forward memory to external Mem0 API: {e}. Storing locally.")

        col = db_manager.get_collection("memento_memories")
        await col.insert_one(entry)
        return entry

    async def retrieve_memories(
        self,
        employee_id: str,
        query: Optional[str] = None,
        memory_type: Optional[str] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Retrieve memories filtered by employee, type, and semantic query."""
        col = db_manager.get_collection("memento_memories")
        mongo_query: Dict[str, Any] = {"employee_id": employee_id}
        if memory_type:
            mongo_query["memory_type"] = memory_type

        cursor = col.find(mongo_query, sort=[("created_at", -1)], limit=limit)
        results = await cursor.to_list(length=limit)

        if query:
            q_lower = query.lower()
            filtered = [
                m for m in results
                if q_lower in m.get("title", "").lower()
                or q_lower in m.get("content", "").lower()
                or any(q_lower in str(v).lower() for v in m.get("details", {}).values())
            ]
            return filtered
        return results

    async def get_learning_history_summary(self, employee_id: str) -> Dict[str, Any]:
        """
        Synthesizes employee learning history for the LLM.
        Prevents recommending already completed courses and ensures progression.
        """
        memories = await self.retrieve_memories(employee_id, limit=50)

        completed_courses = []
        abandoned_courses = []
        demonstrated_skills = []
        preferences = []
        assessment_results = []
        roadmap_history = []

        for m in memories:
            m_type = m.get("memory_type")
            title = m.get("title", "")
            content = m.get("content", "")
            details = m.get("details", {})

            if m_type == MementoMemoryType.COMPLETED_COURSE or "completed" in title.lower():
                completed_courses.append({
                    "title": title,
                    "provider": details.get("provider", "Unknown"),
                    "completed_at": m.get("valid_from")
                })
            elif m_type == MementoMemoryType.ABANDONED_COURSE or "abandoned" in title.lower():
                abandoned_courses.append({
                    "title": title,
                    "reason": details.get("reason", "Pacing too slow/theoretical"),
                    "last_active": m.get("valid_from")
                })
            elif m_type == MementoMemoryType.SKILL_DEMONSTRATED:
                demonstrated_skills.append({
                    "skill": details.get("skill", title),
                    "proficiency": details.get("proficiency", "Intermediate"),
                    "confidence": m.get("confidence", 1.0)
                })
            elif m_type == MementoMemoryType.LEARNING_PREFERENCE:
                preferences.append(content or title)
            elif m_type == MementoMemoryType.ASSESSMENT_PERFORMANCE:
                assessment_results.append({
                    "topic": title,
                    "score": details.get("score", 80),
                    "weaknesses": details.get("weaknesses", [])
                })
            elif m_type == MementoMemoryType.ROADMAP_VERSION:
                roadmap_history.append({
                    "version": details.get("version", 1),
                    "target_role": details.get("target_role", ""),
                    "date": m.get("valid_from")
                })

        return {
            "total_memories": len(memories),
            "completed_courses": completed_courses,
            "abandoned_courses": abandoned_courses,
            "demonstrated_skills": demonstrated_skills,
            "preferences": preferences,
            "assessment_results": assessment_results,
            "roadmap_history": roadmap_history,
            "influences_summary": (
                f"Employee has completed {len(completed_courses)} courses, abandoned {len(abandoned_courses)} courses, "
                f"and demonstrated {len(demonstrated_skills)} verified competencies. Recommendations will advance beyond prior completions."
            )
        }

    async def delete_memory(self, employee_id: str, memory_id: str) -> bool:
        col = db_manager.get_collection("memento_memories")
        res = await col.delete_one({"_id": memory_id, "employee_id": employee_id})
        return bool(res)

    async def clear_all(self, employee_id: str) -> int:
        col = db_manager.get_collection("memento_memories")
        docs = await (col.find({"employee_id": employee_id})).to_list(100)
        for doc in docs:
            await col.delete_one({"_id": doc["_id"]})
        return len(docs)

memento_service = MementoMemoryService()
