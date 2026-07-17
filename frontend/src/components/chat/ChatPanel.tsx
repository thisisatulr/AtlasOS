import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, Sparkles, Paperclip, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
}

const suggestions = [
  "Prepare a sprint review",
  "Summarize this week's Linear issues",
  "Draft a launch email from our latest PR",
  "Find capabilities to sync Notion → Slack",
];

export function ChatPanel({
  messages,
  onSend,
  busy,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  busy?: boolean;
}) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    const t = value.trim();
    if (!t || busy) return;
    onSend(t);
    setValue("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-6 py-6">
        {messages.length === 0 ? (
          <EmptyState onPick={(s) => onSend(s)} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} m={m} />
            ))}
            {busy && <TypingIndicator />}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/40 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <div className="glass flex items-end gap-2 rounded-2xl p-2 shadow-[var(--shadow-elevated)]">
            <button className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="Ask Atlas to orchestrate anything…"
              className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={submit}
              disabled={!value.trim() || busy}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-lg transition",
                value.trim() && !busy
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Atlas Planner · GPT-class routing
            </span>
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" /> ⏎ to send · ⇧⏎ new line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        What should <span className="text-gradient">Atlas</span> orchestrate today?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Describe an outcome. Atlas will plan, route across MCP servers, and execute — live.
      </p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => onPick(s)}
            className="group rounded-xl border border-border bg-card/40 p-3 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-card hover:text-foreground"
          >
            <span className="mr-2 text-primary/80 group-hover:text-primary">›</span>
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card/60 text-foreground ring-1 ring-inset ring-white/5",
        )}
      >
        {m.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)]">
        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
      <div className="flex gap-1 rounded-full bg-card/60 px-3 py-2 ring-1 ring-inset ring-white/5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}