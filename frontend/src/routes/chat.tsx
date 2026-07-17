import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PanelRightOpen, PanelRightClose, Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { WorkflowGraph } from "@/components/workflow/WorkflowGraph";
import { ExecutionPanel } from "@/components/chat/ExecutionPanel";
import { useDemoWorkflow } from "@/components/chat/useDemoWorkflow";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat · AtlasOS" }] }),
  component: ChatRoute,
});

function ChatRoute() {
  const [panelOpen, setPanelOpen] = useState(true);
  const w = useDemoWorkflow();

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Atlas orchestration session</span>
            <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[10px]">live</span>
          </div>
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2 py-1 hover:bg-secondary"
          >
            {panelOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            {panelOpen ? "Hide execution" : "Show execution"}
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-h-0 border-b border-border">
            <ChatPanel messages={w.messages} onSend={w.send} busy={w.busy} />
          </div>
          <div className="relative min-h-0">
            <div className="pointer-events-none absolute left-4 top-3 z-10 text-[10px] uppercase tracking-widest text-muted-foreground">
              Live workflow
            </div>
            {w.nodes.length === 0 ? <EmptyGraph /> : <WorkflowGraph nodes={w.nodes} edges={w.edges} />}
          </div>
        </div>
      </div>

      <ExecutionPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        planner={w.planner}
        events={w.events}
        selectedServers={w.selectedServers}
        recommendations={w.recommendations}
        logs={w.logs}
      />
    </div>
  );
}

function EmptyGraph() {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-dashed border-border bg-card/30 text-muted-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Workflow graph will render live as Atlas plans and executes your request.
        </p>
      </div>
    </div>
  );
}