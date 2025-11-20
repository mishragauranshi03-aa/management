from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth, tasks

app = FastAPI(title="Employee Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Employee Management API is running"}

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
