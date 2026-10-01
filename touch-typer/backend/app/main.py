from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, AsyncSessionLocal
from app.models import User
from app.api.telemetry import router as telemetry_router
from sqlalchemy import select

app = FastAPI(title="Touch Typer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    # 1. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Seed default user (id=1) for local development
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.id == 1))
        user = result.scalars().first()
        if not user:
            default_user = User(
                id=1,
                username="snowchildwolf",
                email="snowchildwolf@example.com",
                hashed_password="not_a_real_password_hash"
            )
            session.add(default_user)
            await session.commit()