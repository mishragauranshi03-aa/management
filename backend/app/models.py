from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    role = Column(String(20))  # Admin / Employee

    tasks = relationship("Task", back_populates="assigned_to_user")


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(String(500))
    assigned_to = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="Pending")  # ✅ NEW FIELD ADDED

    assigned_to_user = relationship("User", back_populates="tasks")
