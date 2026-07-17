import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldCheck, Star, Download, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { marketplace } from "@/lib/mock";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace · AtlasOS" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [installed, setInstalled] = useState<Record<string, boolean>>({});

  const install = (id: string) => {
    if (progress[id] !== undefined) return;
    setProgress((p) => ({ ...p, [id]: 0 }));
    const iv = setInterval(() => {
      setProgress((p) => {
        const cur = (p[id] ?? 0) + Math.round(6 + Math.random() * 12);
        if (cur >= 100) {
          clearInterval(iv);
          setInstalled((x) => ({ ...x, [id]: true }));
          return { ...p, [id]: 100 };
        }
        return { ...p, [id]: cur };
      });
    }, 220);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        eyebrow="Marketplace"
        title="Discover MCP Servers"
        description="Curated, verified servers from the Atlas registry. One click, zero setup."
      />
      <div className="mb-6 flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search capability or server…"
            className="h-9 w-full rounded-lg border border-border bg-card/50 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {marketplace.map((m, i) => {
          const Icon = m.icon;
          const p = progress[m.id];
          const done = installed[m.id];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md transition hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${m.color} 22%, transparent)`, color: m.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{m.name}</span>
                    {m.verified && <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--info)]" />}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{m.description}</div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current text-primary" /> {m.popularity}</span>
                    <span>{m.capabilities} capabilities</span>
                    <span>v{m.version}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.button
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 py-2 text-xs font-medium text-[color:var(--success)]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Installed
                    </motion.button>
                  ) : p !== undefined ? (
                    <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Installing…</span>
                        <span>{p}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                        <motion.div
                          className="h-full bg-[image:var(--gradient-primary)]"
                          animate={{ width: `${p}%` }}
                          transition={{ ease: "linear", duration: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="install"
                      onClick={() => install(m.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110"
                    >
                      <Download className="h-3.5 w-3.5" /> Recommend install
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}