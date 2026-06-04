# app/database.py
import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql+psycopg2://user:postgres@localhost:5432/todo_list"

# app/database.py
import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"], echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

