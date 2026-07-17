import asyncio
import time
from typing import Dict, List
from app.execution.models import StepExecutionResult, StepStatus
from app.planner.models import DynamicExecutionPlan, PlanStep
from app.capabilities.registry import capability_registry

class NitroExecutionEngine:
    """
    [✅ Must Have] Iterates through planned target tasks, monitors state changes,
    handles code boundary failures, and yields runtime events.
    """
    def __init__(self):
        self._active_jobs: Dict[int, str] = {}

    async def execute_plan(self, plan: DynamicExecutionPlan) -> List[StepExecutionResult]:
        results = []
        
        print(f"[AtlasOS Hypervisor] Initiating execution track for goal: '{plan.goal}'")
        
        for step in plan.steps:
            # 1. Initialize result state record
            run_record = StepExecutionResult(step_id=step.step_id, status=StepStatus.RUNNING)
            print(f"[Step {step.step_id}] Processing state -> {step.capability_name}...")
            
            start_time = time.perf_counter()
            
            # 2. Verify resource mapping parameters in our system capability registry
            target_capability = capability_registry.select_optimal_capability(step.capability_name)
            
            if not target_capability:
                run_record.status = StepStatus.FAILED
                run_record.error_message = f"Capability missing anomaly: '{step.capability_name}' cannot be resolved."
                print(f"[Step {step.step_id}] Fatal Execution Encountered: {run_record.error_message}")
                results.append(run_record)
                # Halt sequential pipeline executions if a core step breaks down
                break
                
            try:
                # --- Fast Hackathon Mode: Simulated Interactive Execution Node ---
                # Yields responsive timing profiles that mimic live network calls.
                simulated_latency = target_capability.latency_estimate_ms / 1000.0
                await asyncio.sleep(simulated_latency)
                
                # Formulate structural data returns based on tool types
                run_record.status = StepStatus.COMPLETED
                run_record.output_data = {
                    "execution_confirmation": "Success",
                    "processed_tool": step.capability_name,
                    "arguments_echo": step.input_arguments,
                    "payload_summary": f"Extracted target content matching requirements safely for statement: '{step.reason}'"
                }
                
            except Exception as e:
                run_record.status = StepStatus.FAILED
                run_record.error_message = f"Runtime operational error: {str(e)}"
                print(f"[Step {step.step_id}] Execution Crash: {str(e)}")
                
            end_time = time.perf_counter()
            run_record.execution_time_ms = int((end_time - start_time) * 1000)
            
            print(f"[Step {step.step_id}] Finished tracking with state status: {run_record.status.value} in {run_record.execution_time_ms}ms")
            results.append(run_record)
            
        return results

execution_engine = NitroExecutionEngine()