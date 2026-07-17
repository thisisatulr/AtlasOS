import { type ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  MessageSquare,
  Server,
  Sparkles,
  Store,
  Workflow,
  History,
  Terminal,
  Settings,
  Search,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/servers", label: "Servers", icon: Server },
  { to: "/capabilities", label: "Capabilities", icon: Sparkles },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/workflows", label: "Workflows", icon: Workflow },
  { to: "/history", label: "History", icon: History },
  { to: "/logs", label: "Logs", icon: Terminal },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative z-20 flex h-full flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl"
      >
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 20L12 4l8 16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 14h9" strokeLinecap="round" />
            </svg>
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="flex flex-col leading-tight"
              >
                <span className="text-sm font-semibold tracking-tight">AtlasOS</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  MCP Control Plane
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-sidebar-accent ring-1 ring-inset ring-white/5"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4 shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      className="relative z-10 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="min-h-0 flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/40 px-4 backdrop-blur-xl">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search servers, capabilities, workflows…"
          className="h-9 w-full rounded-lg border border-border bg-card/50 pl-8 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--success)] opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-[color:var(--success)]" />
          </span>
          <span className="text-muted-foreground">Connected</span>
          <span className="text-foreground/80">· 12 servers</span>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
          AT
        </button>
      </div>
    </header>
  );
}

export function StatusDot({ status }: { status: "online" | "offline" | "degraded" }) {
  const map = {
    online: "bg-[color:var(--success)]",
    offline: "bg-muted-foreground",
    degraded: "bg-[color:var(--warning)]",
  } as const;
  return <Circle className={cn("h-2 w-2 fill-current text-transparent rounded-full", map[status])} />;
}