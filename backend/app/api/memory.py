from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.security import get_current_user
from app.models.learning_history import MemoryStoreRequest, MemoryQueryRequest
from app.services.memento_service import memento_service

router = APIRouter(prefix="/memory", tags=["AI Memory"])

@router.get("/history")
async def get_memory_history(
    memory_type: Optional[str] = None,
    query: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve Memento persistent memory records."""
    employee_id = current_user["id"]
    memories = await memento_service.retrieve_memories(
        employee_id=employee_id,
        query=query,
        memory_type=memory_type,
        limit=50
    )
    summary = await memento_service.get_learning_history_summary(employee_id)
    return {
        "memories": memories,
        "count": len(memories),
        "summary": summary
    }

@router.post("/store")
async def store_memory(
    req: MemoryStoreRequest,
    current_user: dict = Depends(get_current_user)
):
    """Store persistent memory entry."""
    entry = await memento_service.store_memory(
        employee_id=current_user["id"],
        memory_type=req.memory_type,
        title=req.title,
        content=req.content,
        details=req.details,
        confidence=req.confidence or 1.0,
        source=req.source or "manual_entry"
    )
    return entry

@router.post("/retrieve")
async def retrieve_memories(
    req: MemoryQueryRequest,
    current_user: dict = Depends(get_current_user)
):
    """Query memories semantically."""
    memories = await memento_service.retrieve_memories(
        employee_id=current_user["id"],
        query=req.query,
        memory_type=req.memory_type,
        limit=req.limit or 20
    )
    return {"results": memories, "count": len(memories)}

@router.delete("/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a memory item."""
    success = await memento_service.delete_memory(current_user["id"], memory_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory item not found.")
    return {"message": "Memory entry deleted successfully."}

@router.delete("/all")
async def clear_all_memories(current_user: dict = Depends(get_current_user)):
    """Reset learning memory for this employee."""
    cleared = await memento_service.clear_all(current_user["id"])
    return {"message": f"Cleared {cleared} memory records."}
