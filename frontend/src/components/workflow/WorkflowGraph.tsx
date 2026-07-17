import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "reactflow";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Clock, XCircle, PauseCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "pending" | "running" | "completed" | "failed" | "waiting";

export interface WorkflowNodeData {
  label: string;
  server: string;
  capability: string;
  status: NodeStatus;
  duration?: string;
  icon?: LucideIcon;
}

const statusStyles: Record<
  NodeStatus,
  { ring: string; dot: string; label: string; Icon: LucideIcon; glow?: string }
> = {
  pending:   { ring: "ring-white/10",                dot: "bg-muted-foreground",        label: "Pending",   Icon: Clock },
  running:   { ring: "ring-[color:var(--info)]/50", dot: "bg-[color:var(--info)]",      label: "Running",   Icon: Loader2, glow: "shadow-[0_0_30px_-4px_var(--info)]" },
  completed: { ring: "ring-[color:var(--success)]/50", dot: "bg-[color:var(--success)]",label: "Completed", Icon: CheckCircle2 },
  failed:    { ring: "ring-destructive/50",         dot: "bg-destructive",              label: "Failed",    Icon: XCircle },
  waiting:   { ring: "ring-[color:var(--warning)]/50", dot: "bg-[color:var(--warning)]",label: "Waiting",   Icon: PauseCircle, glow: "shadow-[0_0_30px_-4px_var(--warning)]" },
};

function WorkflowNodeCard({ data }: NodeProps<WorkflowNodeData>) {
  const s = statusStyles[data.status];
  const Icon = data.icon ?? s.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "min-w-[220px] rounded-xl border border-border bg-card/90 p-3 backdrop-blur ring-1",
        s.ring,
        data.status === "running" && s.glow,
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-primary" />
      <div className="flex items-start gap-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/70">
          <Icon className={cn("h-4 w-4", data.status === "running" && "animate-spin")} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {data.server}
            </span>
          </div>
          <div className="mt-0.5 truncate text-sm font-medium">{data.label}</div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
            <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-muted-foreground">
              {data.capability}
            </code>
            <span className="text-muted-foreground">{data.duration ?? "—"}</span>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-primary" />
    </motion.div>
  );
}

const nodeTypes = { atlas: WorkflowNodeCard };

export function WorkflowGraph({
  nodes,
  edges,
}: {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}) {
  const rfNodes = useMemo(() => nodes.map((n) => ({ ...n, type: "atlas" as const })), [nodes]);
  const onInit = useCallback(() => {}, []);
  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={rfNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        onInit={onInit}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll
      >
        <Background gap={20} size={1} color="oklch(0.5 0.02 260 / 0.25)" />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable maskColor="oklch(0.15 0.015 260 / 0.6)" nodeColor={() => "oklch(0.72 0.19 265)"} />
      </ReactFlow>
    </div>
  );
}