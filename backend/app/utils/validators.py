import re
from typing import Dict, Any, List

def sanitize_search_query(query: str) -> str:
    """Sanitize and clamp search query length."""
    if not query:
        return ""
    # Strip dangerous characters and excessive spaces
    cleaned = re.sub(r'[^\w\s\-\.\,\+\#]', '', query).strip()
    return cleaned[:100]

def validate_skill_name(skill_name: str) -> str:
    cleaned = skill_name.strip()
    if not cleaned:
        raise ValueError("Skill name cannot be empty")
    return cleaned[:60]

def clean_scraped_content(text: str, max_chars: int = 4000) -> str:
    """Clean untrusted scraped content, remove scripts/excessive white space."""
    if not text:
        return ""
    # Remove HTML tags if present
    clean = re.sub(r'<[^>]+>', ' ', text)
    # Remove excessive blank lines
    clean = re.sub(r'\n{3,}', '\n\n', clean)
    clean = re.sub(r'[ \t]{2,}', ' ', clean)
    return clean[:max_chars].strip()
