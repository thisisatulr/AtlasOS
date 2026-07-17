import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui-bits/PageHeader";

const runs = [
  {
    id: "r1", name: "Sprint review", status: "success", duration: "6.4s", when: "2 min ago",
    reason: "User requested a sprint review. Planner routed via Linear, GitHub, Notion, Calendar, Slack.",
    steps: [
      { s: "success", t: "planner.plan", ms: 420 },
      { s: "success", t: "linear.list_issues", ms: 812 },
      { s: "success", t: "github.search_prs", ms: 945 },
      { s: "success", t: "llm.summarize", ms: 702 },
      { s: "success", t: "notion.create_page", ms: 894 },
      { s: "success", t: "calendar.create_event", ms: 703 },
      { s: "success", t: "slack.post_message", ms: 604 },
    ],
  },
  {
    id: "r2", name: "Weekly OKR digest", status: "success", duration: "4.1s", when: "1 h ago",
    reason: "Scheduled digest. Pulled key results from Notion, summarized, posted to leadership.",
    steps: [
      { s: "success", t: "notion.query_db", ms: 620 },
      { s: "success", t: "llm.summarize", ms: 1200 },
      { s: "success", t: "slack.post_message", ms: 480 },
    ],
  },
  {
    id: "r3", name: "Data export", status: "failed", duration: "1.2s", when: "3 h ago",
    reason: "AWS S3 server offline; export could not upload.",
    steps: [
      { s: "success", t: "postgres.run_query", ms: 220 },
      { s: "failed", t: "s3.put_object", ms: 980 },
    ],
  },
];

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Execution history · AtlasOS" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [open, setOpen] = useState<string | null>("r1");
  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader eyebrow="Observability" title="Execution history" description="Every workflow Atlas has run, with planner reasoning and per-step traces." />
      <div className="space-y-3">
        {runs.map((r) => {
          const active = open === r.id;
          return (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-md">
              <button
                onClick={() => setOpen(active ? null : r.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-secondary/30"
              >
                {r.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.steps.length} steps · {r.duration} · {r.when}
                  </div>
                </div>
                <ChevronDown className={"h-4 w-4 text-muted-foreground transition " + (active ? "rotate-180" : "")} />
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="grid gap-4 p-4 md:grid-cols-3">
                      <div className="rounded-xl border border-border bg-background/40 p-3 text-xs md:col-span-1">
                        <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                          Planner reasoning
                        </div>
                        <p className="text-foreground/80">{r.reason}</p>
                      </div>
                      <ol className="space-y-1.5 md:col-span-2">
                        {r.steps.map((s, i) => (
                          <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs">
                            {s.s === "success" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)]" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-destructive" />
                            )}
                            <code className="flex-1 text-foreground/90">{s.t}</code>
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" /> {s.ms}ms
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}