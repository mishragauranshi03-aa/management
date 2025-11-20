from fastapi import APIRouter, HTTPException
from app.schemas import LoginData, UserCreate, UpdateUserRequest, UserOut
from app.database import get_connection

router = APIRouter()

# ----- LOGIN -----
@router.post("/login")
def login(data: LoginData):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (data.email, data.password)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Role check
    if data.role.strip().lower() != user["role"].strip().lower():  # <-- lowercase compare
        raise HTTPException(status_code=403, detail="Access denied for this role")

    return {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "role": user["role"]
    }

# ----- REGISTER -----
@router.post("/createuser")
def create_user(data: UserCreate):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    cursor.execute("SELECT * FROM users WHERE username=%s", (data.username,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Username already taken")

    cursor.execute(
        "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
        (data.username, data.email, data.password, data.role)
    )
    conn.commit()
    user_id = cursor.lastrowid

    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    new_user = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "id": new_user["id"],
        "username": new_user["username"],
        "email": new_user["email"],
        "role": new_user["role"]
    }

# ----- UPDATE USER -----
@router.put("/updateuser/{user_id}")
def update_user(user_id: int, data: UpdateUserRequest):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # update fields
    username = data.username
    email = data.email
    role = data.role
    password = data.password if data.password else user["password"]

    cursor.execute(
        "UPDATE users SET username=%s, email=%s, password=%s, role=%s WHERE id=%s",
        (username, email, password, role, user_id)
    )
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    updated_user = cursor.fetchone()
    cursor.close()
    conn.close()

    return {
        "message": f"User {user_id} updated successfully",
        "user": updated_user
    }

# ----- DELETE USER -----
@router.delete("/deleteuser/{user_id}")
def delete_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # delete user's tasks first
    cursor.execute("DELETE FROM tasks WHERE assigned_to=%s", (user_id,))
    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": f"User {user_id} deleted successfully"}

# ----- LIST USERS -----
@router.get("/listuser")
def list_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users