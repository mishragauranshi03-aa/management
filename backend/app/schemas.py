from pydantic import BaseModel

# ---------- AUTH / USER ----------
class LoginData(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "Employee"

class UserUpdate(BaseModel):
    email: str
    password: str
    role: str

class UserOut(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True


# ---------- TASK ----------
class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to: int

class TaskUpdate(BaseModel):
    title: str
    description: str
    assigned_to: int

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    assigned_to: int

    class Config:
        from_attributes = True
