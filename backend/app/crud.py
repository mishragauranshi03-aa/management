from app.database import get_connection

# --------------------- USER CRUD ----------------------

def create_user(username, email, password, role):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO users (username, email, password, role)
        VALUES (%s, %s, %s, %s)
    """
    values = (username, email, password, role)

    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()

    return True


def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()
    return user


# --------------------- TASK CRUD ----------------------

def create_task(title, description, assigned_to):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO tasks (title, description, assigned_to)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (title, description, assigned_to))
    conn.commit()

    cursor.close()
    conn.close()
    return True


def get_all_tasks():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()

    cursor.close()
    conn.close()
    return tasks


def update_task(task_id, title, description, status, comment):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        UPDATE tasks SET title=%s, description=%s, status=%s, comment=%s
        WHERE id=%s
    """
    cursor.execute(query, (title, description, status, comment, task_id))
    conn.commit()

    cursor.close()
    conn.close()
    return True


def delete_task(task_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tasks WHERE id=%s", (task_id,))
    conn.commit()

    cursor.close()
    conn.close()
    return True
<<<<<<< HEAD

    def delete_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()

    cursor.close()
    conn.close()
    return True
=======
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
