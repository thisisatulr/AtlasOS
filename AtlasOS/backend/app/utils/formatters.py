from typing import List, Dict, Any

def aggregate_execution_metrics(logs: List[Any]) -> Dict[str, Any]:
    """
    Transforms collection logs into unified dashboard telemetry blocks 
    optimized for immediate frontend chart rendering.
    """
    total_runs = len(logs)
    if total_runs == 0:
        return {"total_duration_ms": 0, "average_latency_ms": 0, "success_rate": 100.0}

    total_time = sum(log.runtime_duration_ms for log in logs)
    successful_runs = sum(1 for log in logs if log.status == "completed")
    
    return {
        "total_duration_ms": total_time,
        "average_latency_ms": int(total_time / total_runs),
        "success_rate": round((successful_runs / total_runs) * 100, 2)
    }