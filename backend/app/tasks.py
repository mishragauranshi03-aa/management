from fastapi import APIRouter, HTTPException, Depends, Path
from sqlalchemy.orm import Session
from app import crud
from app.database import get_db
from pydantic import BaseModel
from typing import List
from app import models
from typing import Optional #🔸 ye line upar imports me add karna na bhoolna


router = APIRouter()

# ----- Schemas -----
class TaskCreateRequest(BaseModel):
    title: str
    description: str
    assigned_to: int

#class TaskUpdateRequest(BaseModel):
   # title: str
    #description: str
   # assigned_to: int
    #status: str

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    status: Optional[str] = None



class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    assigned_to: int

    class Config:
        from_attributes = True

        #  NEW — Get all tasks
@router.get("/get", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    tasks = crud.get_all_tasks(db)
    return tasks

# ----- Get tasks for specific employee -----
@router.get("/get/{assigned_to}", response_model=List[TaskResponse])
def get_tasks_for_employee(assigned_to: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.assigned_to == assigned_to).all()
    return tasks


# ----- Create Task -----
@router.post("/", response_model=TaskResponse)
def create_task(request: TaskCreateRequest, db: Session = Depends(get_db)):
    new_task = crud.create_task(db, request)
    return new_task

# ----- Update Task -----
#@router.put("/tasks/{task_id}", response_model=TaskResponse)
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, request: TaskUpdateRequest, db: Session = Depends(get_db)):
    task = crud.update_task(db, task_id, request.title, request.description, request.assigned_to)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
     #  Update status
    task.status = request.status
    db.commit()
    db.refresh(task)
    return task

# ----- Delete Task -----
@router.delete("/delete/{task_id}")
def delete_task(task_id: int = Path(...), db: Session = Depends(get_db)):
    task = crud.delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": f"Task {task_id} deleted successfully"}

# ----- Get Tasks for User -----
@router.get("/user/{user_id}", response_model=List[TaskResponse])
def get_user_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = crud.get_tasks_for_user(db, user_id)
    return tasks