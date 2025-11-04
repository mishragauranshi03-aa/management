print(">>> auth.py start")
from fastapi import APIRouter, HTTPException, Depends, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app import crud
from app.database import get_db

router = APIRouter()

# ----- Schemas -----

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str  # ✅ Added role field for role-based login check


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "Employee"

#login

#@router.post("/login")
#def login(request: LoginRequest, db: Session = Depends(get_db)):
  #  user = crud.authenticate_user(db, request.email, request.password)
   # if not user:
       # raise HTTPException(status_code=400, detail="Invalid credentials")

    # ✅ Fix: role check add kiya (backend filter)
    #if user.role != request.role:
     #   raise HTTPException(status_code=403, detail="Access denied for this role")
    #return {"id": user.id, "email": user.email, "role": user.role}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    if not request.email.endswith("@gmail.com"):
        raise HTTPException(status_code=400, detail="Only Gmail addresses are allowed")
    user = crud.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

     #✅ Fix: role check add kiya (backend filter)
    if user.role != request.role:
        raise HTTPException(status_code=403, detail="Access denied for this role")
    return {"id": user.id, "email": user.email, "role": user.role}


# ----- Create User -----
@router.post("/createuser")
def create_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, request.email)
    if existing_user:
       raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, request)
    return {"id": new_user.id, "email": new_user.email, "role": new_user.role}

#@router.post("/login")
#def login(request: LoginRequest, db: Session = Depends(get_db)):
   # if not request.email.endswith("@gmail.com"):
        #raise HTTPException(status_code=400, detail="Only Gmail addresses are allowed")

   # user = crud.authenticate_user(db, request.email, request.password)
   # if not user:
       # raise HTTPException(status_code=400, detail="Invalid credentials")

  #  return {"id": user.id, "email": user.email, "role": user.role}


# ----- Delete User -----
@router.delete("/deleteuser/{user_id}")
def delete_user(user_id: int = Path(...), db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} deleted successfully"}

# ----- Update User -----
from pydantic import BaseModel

class UpdateUserRequest(BaseModel):
    email: str
    password: str
    role: str

@router.put("/updateuser/{user_id}")
def update_user(user_id: int, request: UpdateUserRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.email = request.email
    user.password = request.password
    user.role = request.role
    db.commit()
    db.refresh(user)
    return {"message": f"User {user_id} updated successfully", "user": user}


# ----- Get All Users -----
@router.get("/listuser")
def list_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users