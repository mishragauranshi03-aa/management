from fastapi import APIRouter, HTTPException
from app.schemas import TaskCreateRequest, TaskUpdateRequest, TaskResponse
from app.database import get_connection
from typing import List

router = APIRouter()

# ----- GET ALL TASKS -----
@router.get("/get", response_model=List[TaskResponse])
def get_all_tasks():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return tasks

# ----- GET TASKS FOR USER -----
@router.get("/user/{user_name}", response_model=List[TaskResponse])
def get_user_tasks(user_name: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks WHERE assigned_user_name=%s", (user_name,))
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return tasks

# ----- CREATE TASK -----
@router.post("/create", response_model=TaskResponse)
def create_task(data: TaskCreateRequest):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "INSERT INTO tasks (title, description, assigned_user_name, status) VALUES (%s,%s,%s,%s)",
        (data.title, data.description, data.assigned_user_name, "Pending")
    )
    conn.commit()
    task_id = cursor.lastrowid

    cursor.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
    new_task = cursor.fetchone()
    cursor.close()
    conn.close()
    return new_task

# ----- UPDATE TASK -----
@router.put("/update/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, data: TaskUpdateRequest):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
    task = cursor.fetchone()
    if not task:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    title = data.title or task["title"]
    description = data.description or task["description"]
    assigned_user_name = data.assigned_user_name or task["assigned_user_name"]
    status = data.status or task.get("status", "Pending")

    cursor.execute(
        "UPDATE tasks SET title=%s, description=%s, assigned_user_name=%s, status=%s WHERE id=%s",
        (title, description, assigned_user_name, status, task_id)
    )
    conn.commit()

    cursor.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
    updated_task = cursor.fetchone()
    cursor.close()
    conn.close()
    return updated_task

# ----- DELETE TASK -----
@router.delete("/delete/{task_id}")
def delete_task(task_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks WHERE id=%s", (task_id,))
    task = cursor.fetchone()
    if not task:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    cursor.execute("DELETE FROM tasks WHERE id=%s", (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": f"Task {task_id} deleted successfully"}
