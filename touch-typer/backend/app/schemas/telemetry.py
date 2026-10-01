from pydantic import BaseModel
from typing import List

class BigramSampleSchema(BaseModel):
    key_a: str
    key_b: str
    latency_ms: float
    is_error: bool

class SessionTelemetryPayload(BaseModel):
    user_id: int
    net_wpm: float
    raw_wpm: float
    accuracy: float
    total_errors: int
    duration_seconds: float
    samples: List[BigramSampleSchema]