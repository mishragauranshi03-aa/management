from pydantic import BaseModel
from typing import Optional

# ---------- AUTH / USER ----------
class LoginData(BaseModel):
    email: str
    password: str
    role: str 


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "Employee"

class UpdateUserRequest(BaseModel):
    username: str
    email: str
    password: Optional[str] = None
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True

# ---------- TASK ----------
class TaskCreateRequest(BaseModel):
    title: str
    description: str
    assigned_user_name: Optional[str] = None
   # comment: str = ""

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_user_name: Optional[str] = None
    status: Optional[str] = None
    #comment: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    assigned_user_name: Optional[str] = None
    status: Optional[str] = None
    #comment: Optional[str] = None

    class Config:
        from_attributes = True