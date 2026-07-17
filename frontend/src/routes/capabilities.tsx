import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Star } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { capabilities } from "@/lib/mock";

export const Route = createFileRoute("/capabilities")({
  head: () => ({ meta: [{ title: "Capabilities · AtlasOS" }] }),
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const categories = Array.from(new Set(capabilities.map((c) => c.category)));
  const filtered = useMemo(
    () =>
      capabilities.filter(
        (c) =>
          (!cat || c.category === cat) &&
          (c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.description.toLowerCase().includes(q.toLowerCase()) ||
            c.server.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        eyebrow="Explorer"
        title="Capabilities"
        description="Every atomic action Atlas can invoke across your connected MCP servers, ranked by planner score."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search capabilities…"
            className="h-9 w-full rounded-lg border border-border bg-card/50 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card/50 p-1 text-xs">
          <Filter className="ml-1 h-3 w-3 text-muted-foreground" />
          <button
            onClick={() => setCat(null)}
            className={"rounded-md px-2 py-1 " + (cat === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={"rounded-md px-2 py-1 " + (cat === c ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 * i }}
            className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md transition hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <code className="text-sm font-medium">{c.name}</code>
                <div className="mt-1 text-xs text-muted-foreground">{c.description}</div>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1 text-[11px] text-primary">
                <Star className="h-3 w-3 fill-current" /> {c.score.toFixed(2)}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="rounded-full border border-border bg-background/40 px-2 py-0.5">{c.server}</span>
              <span className="rounded-full border border-border bg-background/40 px-2 py-0.5 text-muted-foreground">{c.category}</span>
              {c.tags.map((t) => (
                <span key={t} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}