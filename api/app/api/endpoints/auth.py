from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core import security
from app.core.config import settings
from app.db.mongo import get_database
from app.schemas.user import UserCreate, UserOut, UserInDB, Token
from bson import ObjectId

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    identifier = form_data.username.lower().strip()
    # Find user by username or email
    user = await db.users.find_one({
        "$or": [
            {"username": identifier},
            {"email": identifier}
        ]
    })
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist",
        )
    
    if not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=UserOut)
async def signup(
    user_in: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Normalize inputs
    email = user_in.email.lower().strip()
    username = user_in.username.lower().strip()
    
    existing_email = await db.users.find_one({"email": email})
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = await db.users.find_one({"username": username})
    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    # Create UserInDB instance
    user_db = UserInDB(
        full_name=user_in.full_name,
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    
    # Insert into MongoDB
    user_data = user_db.model_dump(by_alias=True, exclude={"id"})
    result = await db.users.insert_one(user_data)
    
    # Fetch and return created user
    created_user_doc = await db.users.find_one({"_id": result.inserted_id})
    return UserInDB(**created_user_doc)
