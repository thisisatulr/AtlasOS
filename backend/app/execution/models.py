from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"

class StepExecutionResult(BaseModel):
    step_id: int
    status: StepStatus = StepStatus.PENDING
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_time_ms: int = 0