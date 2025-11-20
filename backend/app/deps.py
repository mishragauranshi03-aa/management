import mysql.connector
from fastapi import HTTPException
from .database import get_connection

def get_user_by_id(user_id: int):
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user