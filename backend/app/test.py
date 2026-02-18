from sqlalchemy.exc import SQLAlchemyError
# from app.database import SessionLocal  # or import from wherever your SessionLocal is
from database import SessionLocal
from sqlalchemy import text

def test_db_connection():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))  #  Use text() here
        print(" Database connection successful.")
    except SQLAlchemyError as e:
        print(" Database connection failed.")
        print(f"Error: {e}")
    finally:
        db.close()

# Run the test
if __name__ == "__main__":
    test_db_connection()