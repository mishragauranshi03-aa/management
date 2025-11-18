from sqlalchemy.orm import Session
from . import models

# ============================
# ----- USER CRUD -----
# ============================

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email, models.User.password == password).first()
    return user


def get_users(db: Session):
    return db.query(models.User).all()

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        # Delete all tasks assigned to this user
        tasks = db.query(models.Task).filter(models.Task.assigned_to == user.id).all()
        for task in tasks:
            db.delete(task)
        db.delete(user)
        db.commit()
    return user

# ============================
# ----- TASK CRUD -----
# ============================

def create_task(db: Session, task):
    db_task = models.Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        comment=task.comment
        
      )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_all_tasks(db: Session):
    return db.query(models.Task).all()

def get_tasks_for_user(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.assigned_to == user_id).all()

def update_task(db: Session, task_id: int, title: str, description: str, assigned_to: int):
    task = get_task(db, task_id)
    if task:
        task.title = title
        task.description = description
        task.assigned_to = assigned_to
        db.commit()
        db.refresh(task)
    return task



def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    if task:
        db.delete(task)
        db.commit()
    return task

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()