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
<<<<<<< HEAD
    assigned_user_name: Optional[str] = None
   # comment: str = ""
=======
    assigned_to: int
    comment: str = ""
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
<<<<<<< HEAD
    assigned_user_name: Optional[str] = None
    status: Optional[str] = None
    #comment: Optional[str] = None
=======
    assigned_to: Optional[int] = None
    status: Optional[str] = None
    comment: Optional[str] = None
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
<<<<<<< HEAD
    assigned_user_name: Optional[str] = None
    status: Optional[str] = None
    #comment: Optional[str] = None
=======
    assigned_to: int
    status: Optional[str] = None
    comment: Optional[str] = None
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

    class Config:
        from_attributes = True