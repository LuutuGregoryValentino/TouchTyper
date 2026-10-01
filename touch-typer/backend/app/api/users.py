from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import hash_password
from app.database import get_db
from app.models import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    payload: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return current_user

    for field in ("email", "username"):
        value = updates.get(field)
        if value and value != getattr(current_user, field):
            existing = await db.execute(
                select(User).where(
                    getattr(User, field) == value,
                    User.id != current_user.id,
                )
            )
            if existing.scalar_one_or_none() is not None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{field.capitalize()} is already in use")

    password = updates.pop("password", None)
    for field, value in updates.items():
        setattr(current_user, field, value)
    if password:
        current_user.hashed_password = hash_password(password)

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username is already in use")
    await db.refresh(current_user)
    return current_user
