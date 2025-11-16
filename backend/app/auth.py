from fastapi import APIRouter, HTTPException, Depends, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app import crud
from app.database import get_db
from typing import Optional

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str
    username: Optional[str] = None
    role: Optional[str] = None


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "Employee"


# ----- Login -----
@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    # Gmail check
    if not request.email.endswith("@gmail.com"):
        raise HTTPException(status_code=400, detail="Only Gmail addresses are allowed")

    user = crud.authenticate_user(db, request.email, request.password)
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Optional role check
    if request.role and user.role != request.role:
        raise HTTPException(status_code=403, detail="Access denied for this role")

    # ✅ Proper JSON response (frontend expects this)
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role": user.role
    }


    # ✅ Fix: role check add kiya (backend filter)
   # if user.role != request.role:
       # raise HTTPException(status_code=403, detail="Access denied for this role")
   # return {"id": user.id, "email": user.email, "role": user.role}

    if request.role is not None and user.role != request.role:
      raise HTTPException(status_code=403, detail="Access denied for this role")


# ----- Create User -----
@router.post("/createuser")
def create_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, request)
    return {"id": new_user.id, "username": new_user.username, "email": new_user.email, "role": new_user.role}


# ----- Delete User -----
@router.delete("/deleteuser/{user_id}")
def delete_user(user_id: int = Path(...), db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} deleted successfully"}


# ----- Update User (FIXED) -----
from pydantic import BaseModel

class UpdateUserRequest(BaseModel):
    username: str
    email: str
    password: str | None = None  # ✅ Password optional
    role: str

@router.put("/updateuser/{user_id}")
def update_user(user_id: int, request: UpdateUserRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Always update email and role
    user.username = request.username
    user.email = request.email
    user.role = request.role

    # ✅ Only update password if provided (not empty)
    if request.password and request.password.strip() != "":
        user.password = request.password  # or use your hash_password() here

    db.commit()
    db.refresh(user)
    return {"message": f"User {user_id} updated successfully", "user": user}


# ----- Get All Users -----
@router.get("/listuser")
def list_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users
