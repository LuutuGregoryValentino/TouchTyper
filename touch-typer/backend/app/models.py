from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)
    bio = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    sessions = relationship("TypingSession", back_populates="user", cascade="all, delete-orphan")
    bigram_metrics = relationship("BigramMetric", back_populates="user", cascade="all, delete-orphan")


class TypingSession(Base):
    __tablename__ = "typing_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    net_wpm = Column(Float, nullable=False)
    raw_wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    total_errors = Column(Integer, nullable=False)
    duration_seconds = Column(Float, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")


class BigramMetric(Base):
    __tablename__ = "bigram_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Key transition pair (e.g., key_a = 'f', key_b = 'r')
    key_a = Column(String(5), nullable=False)
    key_b = Column(String(5), nullable=False)
     
    total_attempts = Column(Integer, default=0, nullable=False)
    total_errors = Column(Integer, default=0, nullable=False)
    avg_latency_ms = Column(Float, default=0.0, nullable=False)
    
    # Combined calculated difficulty weight
    friction_weight = Column(Float, default=0.0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bigram_metrics")

    # Composite index for fast lookup of a user's specific key pair
    __table_args__ = (
        Index("idx_user_bigram", "user_id", "key_a", "key_b", unique=True),
    )