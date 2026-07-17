from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.session import get_db
from app.discovery.engine import discovery_engine
from app.capabilities.registry import capability_registry
from app.planner.service import workflow_planner
from app.execution.engine import execution_engine
from app.marketplace.service import marketplace_service
from app.memory.repository import memory_repository
from app.models.memory import ExecutionLog  # Explicit reference import for dashboard queries
from app.utils.formatters import aggregate_execution_metrics

router = APIRouter()

@router.get("/servers", tags=["Discovery"])
async def get_discovered_servers():
    return await discovery_engine.discover_servers()

@router.get("/capabilities", tags=["Registry"])
def get_registered_capabilities():
    return capability_registry.list_all()

@router.get("/marketplace", tags=["Marketplace"])
def search_marketplace(keyword: str = ""):
    if keyword:
        return marketplace_service.search_by_keyword(keyword)
    return marketplace_service._store_inventory

@router.get("/dashboard/stats", tags=["Telemetry Dashboard"])
def get_dashboard_telemetry(db: Session = Depends(get_db)):
    """[✅ Must Have] Computes high-speed metric analytics summaries for the primary React grid panels."""
    all_logs = db.query(ExecutionLog).all()
    metrics = aggregate_execution_metrics(all_logs)
    
    return {
        "total_mapped_servers": len(discovery_engine._registry),
        "total_active_capabilities": len(capability_registry.list_all()),
        "system_performance": metrics
    }

@router.post("/plan", tags=["Hypervisor Core"])
def create_execution_plan(payload: Dict[str, str], db: Session = Depends(get_db)):
    goal = payload.get("goal")
    if not goal:
        raise HTTPException(status_code=400, detail="Missing mandatory string parameter: 'goal'")
    session = memory_repository.create_session(db, user_goal=goal)
    plan = workflow_planner.generate_plan(goal)
    stored_plan = memory_repository.store_execution_plan(db, session_id=session.id, plan_data=plan.dict())
    return {"session_id": session.id, "plan_id": stored_plan.id, "blueprint": plan}

@router.post("/execute/{plan_id}", tags=["Hypervisor Core"])
async def run_execution_plan(plan_id: int, db: Session = Depends(get_db)):
    stored_plan_record = db.query(memory_repository.create_session.__self__.StoredPlan).filter(
        memory_repository.create_session.__self__.StoredPlan.id == plan_id
    ).first()
    
    if not stored_plan_record:
        raise HTTPException(status_code=404, detail=f"Target blueprint plan code execution ID {plan_id} not found.")

    from app.planner.models import DynamicExecutionPlan
    plan_blueprint = DynamicExecutionPlan(**stored_plan_record.raw_plan_json)
    execution_results = await execution_engine.execute_plan(plan_blueprint)
    
    for res in execution_results:
        memory_repository.log_step_execution(
            db=db,
            plan_id=plan_id,
            step_id=res.step_id,
            capability=res.processed_tool if hasattr(res, 'processed_tool') else "unknown",
            status=res.status.value,
            output=res.output_data,
            error=res.error_message,
            duration=res.execution_time_ms
        )

    return {
        "plan_id": plan_id,
        "final_status": "completed" if all(r.status == "completed" for r in execution_results) else "failed",
        "details": execution_results
    }

@router.get("/history", tags=["Memory"])
def get_historical_sessions(db: Session = Depends(get_db)):
    return memory_repository.list_all_sessions(db)