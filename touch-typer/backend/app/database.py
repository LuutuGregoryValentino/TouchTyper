import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# Pulls the DATABASE_URL environment variable set in docker-compose.yml
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgrespassword@db:5432/touch_typer_db"
)

# Async database engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Session factory for DB operations
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

# Dependency to yield database sessions in FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:k
        yield session