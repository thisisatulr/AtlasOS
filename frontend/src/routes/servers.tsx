import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { ServerCard } from "@/components/servers/ServerCard";
import { servers } from "@/lib/mock";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Servers · AtlasOS" }] }),
  component: () => (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        eyebrow="Infrastructure"
        title="MCP Servers"
        description="Every MCP endpoint Atlas can route through. Latency and health are polled every 5s."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] px-3 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)]">
            <Plus className="h-4 w-4" /> Connect server
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {servers.map((s, i) => (
          <ServerCard key={s.id} server={s} index={i} />
        ))}
      </div>
    </div>
  ),
});