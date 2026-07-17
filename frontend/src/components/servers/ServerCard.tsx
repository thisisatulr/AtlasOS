import { motion } from "motion/react";
import { RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";
import type { MCPServer } from "@/lib/mock";
import { cn } from "@/lib/utils";

const dot = {
  online: "bg-[color:var(--success)]",
  offline: "bg-muted-foreground",
  degraded: "bg-[color:var(--warning)]",
} as const;

export function ServerCard({ server, index = 0 }: { server: MCPServer; index?: number }) {
  const Icon = server.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md transition hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ background: `color-mix(in oklab, ${server.color} 22%, transparent)`, color: server.color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-medium">{server.name}</span>
            {server.verified && <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--info)]" />}
          </div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{server.description}</div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className={cn("h-1.5 w-1.5 rounded-full", dot[server.status])} />
          <span className="capitalize">{server.status}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Stat label="Capabilities" value={String(server.capabilities)} />
        <Stat label="Latency" value={server.status === "offline" ? "—" : `${server.latencyMs}ms`} />
        <Stat label="Version" value={`v${server.version}`} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs hover:bg-secondary">
          <RefreshCw className="h-3 w-3" /> Reconnect
        </button>
        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          Details <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 py-2">
      <div className="text-sm font-medium">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}