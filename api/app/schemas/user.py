from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

# Helper for ObjectId to string conversion
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserCreate(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    full_name: Optional[str] = None
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class UserOut(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    full_name: Optional[str] = None
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        populate_by_name = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
