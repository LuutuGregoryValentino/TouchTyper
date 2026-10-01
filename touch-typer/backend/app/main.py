from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, AsyncSessionLocal
from app.models import User
from app.api.telemetry import router as telemetry_router
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from sqlalchemy import select
from sqlalchemy import text

app = FastAPI(title="Touch Typer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    # 1. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # create_all does not add columns to tables already present in local volumes.
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR(500)"))
        await conn.execute(text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE "
            "NOT NULL DEFAULT CURRENT_TIMESTAMP"
        ))

    # 2. Seed default user (id=1) for local development
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.id == 1))
        user = result.scalars().first()
        if not user:
            default_user = User(
                id=1,
                username="snowchildwolf",
                email="snowchildwolf@example.com",
                hashed_password=None,
            )
            session.add(default_user)
            await session.commit()
        # The development seed uses an explicit ID; advance PostgreSQL's sequence
        # so newly registered users never collide with it.
        await session.execute(text(
            "SELECT setval(pg_get_serial_sequence('users', 'id'), "
            "GREATEST(COALESCE((SELECT MAX(id) FROM users), 1), 1), true)"
        ))
        await session.commit()