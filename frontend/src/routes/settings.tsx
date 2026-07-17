import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits/PageHeader";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · AtlasOS" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl p-6">
      <PageHeader eyebrow="Workspace" title="Settings" description="Configure your Atlas workspace, model routing, and defaults." />
      <div className="space-y-3">
        {["Profile", "Model routing", "Security & OAuth", "Notifications", "Billing"].map((s) => (
          <div key={s} className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md">
            <div>
              <div className="text-sm font-medium">{s}</div>
              <div className="text-xs text-muted-foreground">Manage {s.toLowerCase()} preferences.</div>
            </div>
            <button className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary">
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  ),
});