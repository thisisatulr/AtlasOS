import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui-bits/PageHeader";

type Line = { t: string; level: "info" | "warn" | "error"; scope: string; text: string };

const seed: Line[] = [
  { t: "12:41:02", level: "info",  scope: "planner",     text: 'compose_dag intent="prepare sprint review"' },
  { t: "12:41:02", level: "info",  scope: "capabilities",text: "rank matches=8 top=list_issues score=0.98" },
  { t: "12:41:03", level: "info",  scope: "exec",        text: "start node=n2 server=linear cap=list_issues" },
  { t: "12:41:03", level: "info",  scope: "linear",      text: "GET /issues?filter=cycle:current 200 in 812ms" },
  { t: "12:41:04", level: "warn",  scope: "gmail",       text: "latency 341ms exceeds SLO 250ms" },
  { t: "12:41:05", level: "info",  scope: "github",      text: "GET /search/prs 200 in 945ms" },
  { t: "12:41:06", level: "info",  scope: "llm",         text: "summarize tokens=1284 model=gpt-4o-mini" },
  { t: "12:41:07", level: "error", scope: "s3",          text: "put_object failed: connection refused" },
  { t: "12:41:08", level: "info",  scope: "marketplace", text: "install pkg=cal-scheduler ok" },
];

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Logs · AtlasOS" }] }),
  component: LogsPage,
});

function LogsPage() {
  const [lines, setLines] = useState<Line[]>(seed);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const scopes = ["planner", "exec", "slack", "notion", "linear", "github", "postgres"] as const;
      const levels: Line["level"][] = ["info", "info", "info", "warn"];
      const now = new Date();
      const p = (n: number) => n.toString().padStart(2, "0");
      setLines((l) =>
        [
          ...l,
          {
            t: `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`,
            level: levels[Math.floor(Math.random() * levels.length)],
            scope: scopes[Math.floor(Math.random() * scopes.length)],
            text: "trace ok in " + (100 + Math.floor(Math.random() * 400)) + "ms",
          },
        ].slice(-200),
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader eyebrow="Runtime" title="Logs" description="Streaming logs across the Atlas orchestrator and every MCP server." />
      <div
        ref={scrollRef}
        className="h-[70vh] overflow-auto rounded-2xl border border-border bg-black/60 p-4 font-mono text-[12px] leading-relaxed backdrop-blur-md"
      >
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-20 shrink-0 text-muted-foreground">{l.t}</span>
            <span
              className={
                "w-12 shrink-0 uppercase " +
                (l.level === "info"
                  ? "text-[color:var(--info)]"
                  : l.level === "warn"
                    ? "text-[color:var(--warning)]"
                    : "text-destructive")
              }
            >
              {l.level}
            </span>
            <span className="w-24 shrink-0 text-primary">{l.scope}</span>
            <span className="text-foreground/85">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}