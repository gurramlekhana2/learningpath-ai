from typing import Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.utils.security import get_current_user
from app.services.firecrawl_service import firecrawl_service

router = APIRouter(prefix="/industry", tags=["Industry Intelligence"])

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

@router.get("/trends")
async def get_industry_trends(role: Optional[str] = Query("AI Engineer")):
    """Get real-time trending technologies and skill demands."""
    intel = await firecrawl_service.get_role_intelligence(role)
    return intel

@router.get("/resources")
async def get_learning_resources(role: Optional[str] = Query("AI Engineer")):
    """Get verified courses and certifications discovered from web intelligence."""
    intel = await firecrawl_service.get_role_intelligence(role)
    return {
        "role": role,
        "learning_resources": intel.get("learning_resources", []),
        "certifications": intel.get("top_certifications", []),
        "sources": intel.get("sources", [])
    }

@router.post("/refresh")
async def refresh_industry_intelligence():
    """Trigger Firecrawl re-crawl and intelligence refresh."""
    res = firecrawl_service.refresh_intelligence()
    return res

@router.post("/search")
async def search_industry_web(req: SearchRequest):
    """Execute live Firecrawl web search for emerging skills."""
    res = await firecrawl_service.search_web_intelligence(req.query, limit=req.limit or 5)
    return res
