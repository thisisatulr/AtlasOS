import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Server,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Timer,
  Store,
  ArrowRight,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { servers, marketplace } from "@/lib/mock";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const activity = [
    { t: "2m ago", text: "Sprint review workflow completed", server: "Slack", tone: "success" as const },
    { t: "6m ago", text: "Installed Stripe MCP from Marketplace", server: "Marketplace", tone: "info" as const },
    { t: "14m ago", text: "Gmail latency degraded to 341ms", server: "Gmail", tone: "warn" as const },
    { t: "22m ago", text: "Postgres query executed in 22ms", server: "Postgres", tone: "success" as const },
    { t: "38m ago", text: "S3 connection lost, retrying…", server: "AWS S3", tone: "error" as const },
  ];
  const online = servers.filter((s) => s.status === "online").length;
  const totalCaps = servers.reduce((a, s) => a + s.capabilities, 0);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        eyebrow="Control plane"
        title="Welcome back to AtlasOS"
        description="Live view of every MCP server, capability, and orchestration flowing through Atlas."
        actions={
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] px-3 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> New orchestration
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatCard index={0} label="Connected servers" value={`${online}/${servers.length}`} delta="+2 this week" icon={Server} />
        <StatCard index={1} label="Capabilities" value={String(totalCaps)} delta="+18" icon={Sparkles} spark={[5,7,6,9,10,12,11,14,16,18]} />
        <StatCard index={2} label="Running workflows" value="3" icon={PlayCircle} spark={[1,0,2,1,3,2,4,3,3,3]} />
        <StatCard index={3} label="Completed today" value="147" delta="+22%" icon={CheckCircle2} spark={[10,14,12,18,20,26,30,34,40,44]} />
        <StatCard index={4} label="Avg exec time" value="1.8s" delta="-0.3s" icon={Timer} spark={[3,2.6,2.4,2.2,2,1.9,1.8,1.9,1.7,1.8]} />
        <StatCard index={5} label="Marketplace" value="4 new" icon={Store} spark={[0,1,2,1,3,2,4,3,4,4]} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Recent activity</h2>
            </div>
            <Link to="/history" className="text-xs text-muted-foreground hover:text-foreground">
              View history →
            </Link>
          </div>
          <ul className="space-y-1">
            {activity.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-secondary/40"
              >
                <span
                  className={
                    "h-1.5 w-1.5 rounded-full " +
                    (a.tone === "success" ? "bg-[color:var(--success)]"
                      : a.tone === "info" ? "bg-[color:var(--info)]"
                      : a.tone === "warn" ? "bg-[color:var(--warning)]"
                      : "bg-destructive")
                  }
                />
                <span className="flex-1">{a.text}</span>
                <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {a.server}
                </span>
                <span className="w-14 text-right text-xs text-muted-foreground">{a.t}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Recommended</h2>
            </div>
            <Link to="/marketplace" className="text-xs text-muted-foreground hover:text-foreground">
              Browse →
            </Link>
          </div>
          <div className="space-y-2">
            {marketplace.slice(0, 3).map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                >
                  <div
                    className="grid h-9 w-9 place-items-center rounded-lg"
                    style={{ background: `color-mix(in oklab, ${m.color} 22%, transparent)`, color: m.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{m.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{m.description}</div>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-md bg-[image:var(--gradient-primary)] px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                    Install <ArrowRight className="h-3 w-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
