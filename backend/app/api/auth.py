import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.employee import EmployeeRegisterRequest, EmployeeLoginRequest, TokenResponse, UserRole
from app.utils.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.database.connection import db_manager

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(req: EmployeeRegisterRequest):
    users_col = db_manager.get_collection("users")
    existing = await users_col.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "id": user_id,
        "email": req.email.lower(),
        "hashed_password": get_password_hash(req.password),
        "full_name": req.full_name,
        "role": req.role.value,
        "department": req.department or "Engineering",
        "current_role": req.current_role or "Software Developer",
        "experience_years": 2.0,
        "skills": [
            {"name": "Python", "proficiency": "Intermediate", "category": "Languages", "years_experience": 2.0, "verified": True},
            {"name": "Git", "proficiency": "Advanced", "category": "Tools", "years_experience": 2.5, "verified": True}
        ],
        "soft_skills": ["Problem Solving", "Collaboration"],
        "career_interests": ["Artificial Intelligence", "Cloud Architecture"],
        "target_role": "AI Engineer",
        "weekly_hours_available": 6,
        "readiness_score": 58.0,
        "onboarding_completed": False,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    await users_col.insert_one(user_doc)

    access_token = create_access_token({"sub": user_id, "role": user_doc["role"]})
    user_info = dict(user_doc)
    user_info.pop("hashed_password", None)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_info
    )

@router.post("/login", response_model=TokenResponse)
async def login(req: EmployeeLoginRequest):
    users_col = db_manager.get_collection("users")
    user = await users_col.find_one({"email": req.email.lower()})
    if not user or not verify_password(req.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    user_id = str(user.get("_id", user.get("id")))
    access_token = create_access_token({"sub": user_id, "role": user.get("role", "employee")})
    user_info = dict(user)
    user_info.pop("hashed_password", None)
    user_info["id"] = user_id
    user_info["_id"] = user_id

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_info
    )

@router.get("/me")
async def get_my_info(current_user: dict = Depends(get_current_user)):
    user_info = dict(current_user)
    user_info.pop("hashed_password", None)
    return user_info
