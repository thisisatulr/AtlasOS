import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Workflow as WorkflowIcon, PlayCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui-bits/PageHeader";

const items = [
  { id: "w1", name: "Sprint review", status: "running", steps: 7, updated: "just now" },
  { id: "w2", name: "Weekly OKR digest", status: "scheduled", steps: 5, updated: "in 2h" },
  { id: "w3", name: "Incident triage", status: "idle", steps: 9, updated: "yesterday" },
  { id: "w4", name: "Customer NPS pipeline", status: "idle", steps: 6, updated: "3d ago" },
];

export const Route = createFileRoute("/workflows")({
  head: () => ({ meta: [{ title: "Workflows · AtlasOS" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader eyebrow="Automations" title="Workflows" description="Saved orchestrations Atlas can rerun or schedule." />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md transition hover:border-primary/40"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/70 text-primary">
              <WorkflowIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{w.name}</div>
              <div className="text-xs text-muted-foreground">{w.steps} steps · updated {w.updated}</div>
            </div>
            <span
              className={
                "rounded-full px-2 py-0.5 text-[11px] " +
                (w.status === "running"
                  ? "bg-[color:var(--info)]/15 text-[color:var(--info)]"
                  : w.status === "scheduled"
                    ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                    : "bg-secondary/60 text-muted-foreground")
              }
            >
              {w.status}
            </span>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-secondary/40 hover:bg-secondary">
              {w.status === "scheduled" ? <Clock className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  ),
});