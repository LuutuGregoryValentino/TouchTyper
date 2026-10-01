from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import TypingSession, BigramMetric
from app.schemas.telemetry import SessionTelemetryPayload
from sqlalchemy import select

router = APIRouter(prefix="/telemetry", tags=["telemetry"])

@router.post("/submit")
async def submit_session_telemetry(payload: SessionTelemetryPayload, db: AsyncSession = Depends(get_db)):
    # 1. Save typing session summary
    session = TypingSession(
        user_id=payload.user_id,
        net_wpm=payload.net_wpm,
        raw_wpm=payload.raw_wpm,
        accuracy=payload.accuracy,
        total_errors=payload.total_errors,
        duration_seconds=payload.duration_seconds
    )
    db.add(session)

    # 2. Process and upsert key-transition bigram metrics
    for sample in payload.samples:
        result = await db.execute(
            select(BigramMetric).where(
                BigramMetric.user_id == payload.user_id,
                BigramMetric.key_a == sample.key_a,
                BigramMetric.key_b == sample.key_b
            )
        )
        metric = result.scalars().first()

        if not metric:
            metric = BigramMetric(
                user_id=payload.user_id,
                key_a=sample.key_a,
                key_b=sample.key_b,
                total_attempts=1,
                total_errors=1 if sample.is_error else 0,
                avg_latency_ms=sample.latency_ms,
                friction_weight=1.0
            )
            db.add(metric)
        else:
            metric.total_attempts += 1
            if sample.is_error:
                metric.total_errors += 1
            
            # Running average update for latency
            metric.avg_latency_ms = (
                (metric.avg_latency_ms * (metric.total_attempts - 1) + sample.latency_ms) 
                / metric.total_attempts
            )
            
            # Calculate composite friction weight: Latency penalty scaled by error rate
            error_rate = metric.total_errors / metric.total_attempts
            metric.friction_weight = metric.avg_latency_ms * (1 + (error_rate * 2.0))

    await db.commit()
    return {"status": "success"}