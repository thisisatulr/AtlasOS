import { useCallback, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";
import type { WorkflowNodeData } from "@/components/workflow/WorkflowGraph";
import type { TimelineEvent, PlannerState } from "@/components/chat/ExecutionPanel";
import type { ChatMessage } from "@/components/chat/ChatPanel";
import {
  Search as SearchIcon,
  Brain,
  Github,
  Slack,
  FileText,
  Calendar,
  Zap,
} from "lucide-react";

let idc = 0;
const uid = (p = "") => `${p}${++idc}`;

type LogLine = { t: string; level: "info" | "warn" | "error"; text: string };

export function useDemoWorkflow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [planner, setPlanner] = useState<PlannerState>("idle");
  const [selectedServers, setSelectedServers] = useState<{ id: string; name: string }[]>([]);
  const [recommendations, setRecommendations] = useState<{ id: string; name: string; reason: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);

  const now = () => {
    const d = new Date();
    const p = (n: number) => n.toString().padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };

  const log = (level: LogLine["level"], text: string) =>
    setLogs((l) => [...l, { t: now(), level, text }]);

  const addEvent = (label: string, status: TimelineEvent["status"], detail?: string) =>
    setEvents((e) => [...e, { id: uid("ev"), label, status, detail, time: now() }]);

  const setNodeStatus = (id: string, status: WorkflowNodeData["status"], duration?: string) =>
    setNodes((ns) =>
      ns.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status, ...(duration ? { duration } : {}) } } : n,
      ),
    );

  const setEdgeAnimated = (id: string, animated: boolean) =>
    setEdges((es) => es.map((e) => (e.id === id ? { ...e, animated } : e)));

  const schedule = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };

  const reset = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setNodes([]);
    setEdges([]);
    setEvents([]);
    setLogs([]);
    setSelectedServers([]);
    setRecommendations([]);
    setPlanner("idle");
  }, []);

  const send = useCallback(
    (text: string) => {
      if (busy) return;
      setBusy(true);
      reset();
      setMessages((m) => [...m, { id: uid("u"), role: "user", text }]);

      const isSprint = /sprint/i.test(text);

      setPlanner("thinking");
      addEvent("Thinking", "running", "Understanding intent");
      log("info", `intent.received "${text}"`);

      schedule(() => {
        setPlanner("planning");
        addEvent("Planning", "running", "Composing execution DAG");
        log("info", "planner.compose_dag");

        const N = (id: string, x: number, y: number, data: WorkflowNodeData): Node<WorkflowNodeData> => ({
          id, position: { x, y }, data, type: "atlas",
        });

        const initial: Node<WorkflowNodeData>[] = isSprint
          ? [
              N("n1", 0, 100, { label: "Analyze intent", server: "Atlas", capability: "planner.plan", status: "completed", icon: Brain, duration: "0.4s" }),
              N("n2", 260, 20, { label: "List Linear issues", server: "Linear", capability: "list_issues", status: "pending", icon: Zap }),
              N("n3", 260, 180, { label: "Fetch GitHub PRs", server: "GitHub", capability: "search_prs", status: "pending", icon: Github }),
              N("n4", 520, 100, { label: "Summarize progress", server: "Atlas", capability: "llm.summarize", status: "pending", icon: SearchIcon }),
              N("n5", 780, 20, { label: "Draft Notion doc", server: "Notion", capability: "create_page", status: "pending", icon: FileText }),
              N("n6", 780, 180, { label: "Book review meeting", server: "Google Calendar", capability: "create_event", status: "pending", icon: Calendar }),
              N("n7", 1040, 100, { label: "Post to #eng-review", server: "Slack", capability: "post_message", status: "pending", icon: Slack }),
            ]
          : [
              N("n1", 0, 100, { label: "Analyze intent", server: "Atlas", capability: "planner.plan", status: "completed", icon: Brain, duration: "0.4s" }),
              N("n2", 260, 40, { label: "Web search", server: "Web Search", capability: "web_search", status: "pending", icon: SearchIcon }),
              N("n3", 260, 160, { label: "Query Postgres", server: "Postgres", capability: "run_query", status: "pending" }),
              N("n4", 520, 100, { label: "Summarize + reply", server: "Atlas", capability: "llm.summarize", status: "pending", icon: Brain }),
            ];

        const E = (id: string, s: string, t: string): Edge => ({ id, source: s, target: t, animated: false });
        const initialEdges = isSprint
          ? [E("e1","n1","n2"),E("e2","n1","n3"),E("e3","n2","n4"),E("e4","n3","n4"),E("e5","n4","n5"),E("e6","n4","n6"),E("e7","n5","n7"),E("e8","n6","n7")]
          : [E("e1","n1","n2"),E("e2","n1","n3"),E("e3","n2","n4"),E("e4","n3","n4")];

        setNodes(initial);
        setEdges(initialEdges);
      }, 900);

      schedule(() => {
        addEvent("Discovering capabilities", "running", "Ranking 214 candidates");
        log("info", "capabilities.rank matches=8");
      }, 1400);

      schedule(() => {
        addEvent("Selecting MCP servers", "completed",
          isSprint ? "Linear, GitHub, Notion, Calendar, Slack" : "Web, Postgres");
        setSelectedServers(
          isSprint
            ? [
                { id: "linear", name: "Linear" },
                { id: "gh", name: "GitHub" },
                { id: "notion", name: "Notion" },
                { id: "gcal", name: "Google Calendar" },
                { id: "slack", name: "Slack" },
              ]
            : [
                { id: "web", name: "Web Search" },
                { id: "pg", name: "Postgres" },
              ],
        );
      }, 1800);

      let t = 2200;
      const step = (id: string, edgeIn: string | null, ms = 900) => {
        if (edgeIn) schedule(() => setEdgeAnimated(edgeIn, true), t);
        schedule(() => {
          setPlanner("executing");
          setNodeStatus(id, "running");
          addEvent(`Executing ${id}`, "running");
          log("info", `exec.start node=${id}`);
        }, t);
        schedule(() => {
          setNodeStatus(id, "completed", `${(ms / 1000).toFixed(1)}s`);
          if (edgeIn) setEdgeAnimated(edgeIn, false);
          log("info", `exec.done node=${id} duration=${ms}ms`);
        }, t + ms);
        t += ms + 100;
      };

      if (isSprint) {
        step("n2", "e1", 800);
        step("n3", "e2", 950);
        step("n4", "e3", 700);

        schedule(() => {
          setNodeStatus("n6", "waiting");
          addEvent("Capability missing", "waiting", "No installed server can create_event");
          log("warn", "capability.missing capability=create_event");
          setRecommendations([
            { id: "cal", name: "Cal.com Scheduler", reason: "Adds create_event with round-robin availability. 4.9 ★" },
          ]);
        }, t);
        t += 900;
        schedule(() => {
          addEvent("Marketplace install", "running", "Installing Cal.com Scheduler…");
          log("info", "marketplace.install pkg=cal-scheduler");
        }, t);
        t += 900;
        schedule(() => {
          addEvent("Marketplace install", "completed", "Installed & authorized");
          setSelectedServers((s) => [...s, { id: "cal", name: "Cal.com" }]);
          log("info", "marketplace.install.done");
        }, t);
        t += 300;

        step("n5", "e5", 900);
        step("n6", "e6", 700);
        step("n7", "e7", 600);
      } else {
        step("n2", "e1", 700);
        step("n3", "e2", 800);
        step("n4", "e3", 700);
      }

      schedule(() => {
        setPlanner("done");
        addEvent("Completed", "completed", "All steps succeeded");
        const reply = isSprint
          ? "Sprint review is ready. I pulled 12 Linear issues and 9 merged PRs, drafted a Notion recap, scheduled the review for Thursday 10:00, and posted the agenda to #eng-review."
          : "Done. Here's a synthesized answer with source citations from the web and your database.";
        setMessages((m) => [...m, { id: uid("a"), role: "assistant", text: reply }]);
        log("info", "workflow.completed");
        setBusy(false);
      }, t + 300);
    },
    [busy, reset],
  );

  return { messages, nodes, edges, events, logs, planner, selectedServers, recommendations, busy, send };
}