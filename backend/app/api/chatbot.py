from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.utils.security import get_current_user
from app.services.llm_service import llm_service
from app.services.memento_service import memento_service
from app.services.firecrawl_service import firecrawl_service

router = APIRouter(prefix="/chat", tags=["AI Mentor Chatbot"])

class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

@router.post("")
async def chat_with_mentor(
    req: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """Interact with the context-aware AI Learning Mentor."""
    employee_id = current_user["id"]
    target_role = current_user.get("target_role", "AI Engineer")

    # 1. Fetch Memento learning memory
    memory_summary = await memento_service.get_learning_history_summary(employee_id)

    # 2. Fetch Firecrawl role intelligence
    industry_data = await firecrawl_service.get_role_intelligence(target_role)

    # 3. Format history
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history or []]

    # 4. Generate contextual reply
    reply_data = await llm_service.generate_mentor_reply(
        employee_profile=current_user,
        memory_summary=memory_summary,
        industry_data=industry_data,
        conversation_history=history_dicts,
        user_message=req.message
    )

    return reply_data
