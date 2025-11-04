from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app import auth, tasks

app = FastAPI(title="Employee Management API")

#  CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Health check route
@app.get("/")
def root():
    return {"message": "Employee Management API is running"}

#  Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

#  Create tables safely (no blocking)
@app.on_event("startup")
def on_startup():
    try:
        print(" Creating database tables...")
        models.Base.metadata.create_all(bind=engine)
        print(" Tables created successfully.")
    except Exception as e:
        print(" Database init failed:", e)
