import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.memory import ChatSession, StoredPlan, ExecutionLog

class AtlasMemoryRepository:
    """
    [✅ Must Have] Coordinates physical data saves, transaction persistence 
    commits, and historical workflow runs for the hypervisor.
    """

    def create_session(self, db: Session, user_goal: str) -> ChatSession:
        session_id = str(uuid.uuid4())
        new_session = ChatSession(id=session_id, user_goal=user_goal)
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session

    def store_execution_plan(self, db: Session, session_id: str, plan_data: Dict[str, Any]) -> StoredPlan:
        stored_plan = StoredPlan(
            session_id=session_id,
            raw_plan_json=plan_data,
            complexity=plan_data.get("estimated_complexity", "medium")
        )
        db.add(stored_plan)
        db.commit()
        db.refresh(stored_plan)
        return stored_plan

    def log_step_execution(
        self, 
        db: Session, 
        plan_id: int, 
        step_id: int, 
        capability: str, 
        status: str, 
        output: Optional[Dict[str, Any]] = None, 
        error: Optional[str] = None,
        duration: int = 0
    ) -> ExecutionLog:
        log_entry = ExecutionLog(
            plan_id=plan_id,
            step_id=step_id,
            capability_name=capability,
            status=status,
            output_payload=output,
            error_summary=error,
            runtime_duration_ms=duration
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

    def get_session_history(self, db: Session, session_id: str) -> Optional[ChatSession]:
        return db.query(ChatSession).filter(ChatSession.id == session_id).first()

    def list_all_sessions(self, db: Session, limit: int = 20) -> List[ChatSession]:
        return db.query(ChatSession).order_by(ChatSession.created_at.desc()).limit(limit).all()

memory_repository = AtlasMemoryRepository()