import { motion, AnimatePresence } from "motion/react";
import { Activity, Brain, Server, Sparkles, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/components/workflow/WorkflowGraph";

export interface TimelineEvent {
  id: string;
  label: string;
  detail?: string;
  status: NodeStatus;
  time: string;
}

export type PlannerState = "idle" | "thinking" | "planning" | "executing" | "done";

export function ExecutionPanel({
  open,
  onClose,
  planner,
  events,
  selectedServers,
  recommendations,
  logs,
}: {
  open: boolean;
  onClose: () => void;
  planner: PlannerState;
  events: TimelineEvent[];
  selectedServers: { id: string; name: string }[];
  recommendations: { id: string; name: string; reason: string }[];
  logs: { t: string; level: "info" | "warn" | "error"; text: string }[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="flex h-full w-[360px] shrink-0 flex-col border-l border-border bg-sidebar/60 backdrop-blur-xl"
        >
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Execution
            </div>
            <button
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-auto p-4">
            <Section title="Planner" icon={Brain}>
              <PlannerView state={planner} />
            </Section>

            <Section title="Selected MCP Servers" icon={Server}>
              <div className="flex flex-wrap gap-1.5">
                {selectedServers.length === 0 && (
                  <span className="text-xs text-muted-foreground">None yet</span>
                )}
                {selectedServers.map((s) => (
                  <span key={s.id} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px]">
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Timeline" icon={Activity}>
              <ol className="space-y-2">
                {events.map((e) => (
                  <motion.li
                    key={e.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative rounded-lg border border-border bg-card/40 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <StatusPip status={e.status} />
                        <span className="font-medium">{e.label}</span>
                      </span>
                      <span className="text-muted-foreground">{e.time}</span>
                    </div>
                    {e.detail && <p className="mt-1 text-muted-foreground">{e.detail}</p>}
                  </motion.li>
                ))}
                {events.length === 0 && (
                  <li className="text-xs text-muted-foreground">No events yet.</li>
                )}
              </ol>
            </Section>

            {recommendations.length > 0 && (
              <Section title="Marketplace Recommendations" icon={Sparkles}>
                <div className="space-y-1.5">
                  {recommendations.map((r) => (
                    <div key={r.id} className="rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{r.name}</span>
                        <button className="rounded-md bg-[image:var(--gradient-primary)] px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Install
                        </button>
                      </div>
                      <p className="mt-1 text-muted-foreground">{r.reason}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Logs" icon={Terminal}>
              <div className="rounded-lg border border-border bg-black/50 p-2 font-mono text-[11px] leading-relaxed">
                {logs.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground">{l.t}</span>
                    <span
                      className={cn(
                        "shrink-0 uppercase",
                        l.level === "info" && "text-[color:var(--info)]",
                        l.level === "warn" && "text-[color:var(--warning)]",
                        l.level === "error" && "text-destructive",
                      )}
                    >
                      {l.level}
                    </span>
                    <span className="text-foreground/80">{l.text}</span>
                  </div>
                ))}
                {logs.length === 0 && <span className="text-muted-foreground">Waiting for events…</span>}
              </div>
            </Section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {title}
      </div>
      {children}
    </div>
  );
}

function StatusPip({ status }: { status: NodeStatus }) {
  const map: Record<NodeStatus, string> = {
    pending: "bg-muted-foreground",
    running: "bg-[color:var(--info)] animate-pulse",
    completed: "bg-[color:var(--success)]",
    failed: "bg-destructive",
    waiting: "bg-[color:var(--warning)] animate-pulse",
  };
  return <span className={cn("h-1.5 w-1.5 rounded-full", map[status])} />;
}

function PlannerView({ state }: { state: PlannerState }) {
  const label: Record<PlannerState, string> = {
    idle: "Idle",
    thinking: "Thinking…",
    planning: "Planning route",
    executing: "Executing",
    done: "Completed",
  };
  const color =
    state === "idle" ? "text-muted-foreground"
    : state === "done" ? "text-[color:var(--success)]"
    : "text-[color:var(--info)]";
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/40 p-2.5 text-xs">
      <span className="relative flex h-2.5 w-2.5">
        {state !== "idle" && state !== "done" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--info)] opacity-60" />
        )}
        <span
          className={cn(
            "relative h-2.5 w-2.5 rounded-full",
            state === "done"
              ? "bg-[color:var(--success)]"
              : state === "idle"
                ? "bg-muted-foreground"
                : "bg-[color:var(--info)]",
          )}
        />
      </span>
      <span className={cn("font-medium", color)}>{label[state]}</span>
    </div>
  );
}