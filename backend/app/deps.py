import mysql.connector
from fastapi import HTTPException
from .database import get_connection

def get_user_by_id(user_id: int):
<<<<<<< HEAD
    
=======
    """
    Direct MySQL query से user fetch करता है
    बिना ORM और बिना token authentication
    """
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
<<<<<<< HEAD
    return user
=======
    return user
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
