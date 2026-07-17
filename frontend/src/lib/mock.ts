import type { LucideIcon } from "lucide-react";
import {
  Github,
  Slack,
  Database,
  Mail,
  Calendar,
  FileText,
  Search,
  Cloud,
  MessageSquare,
  Figma,
  Chrome,
  Zap,
} from "lucide-react";

export type ServerStatus = "online" | "offline" | "degraded";

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  status: ServerStatus;
  capabilities: number;
  latencyMs: number;
  version: string;
  icon: LucideIcon;
  color: string;
  verified?: boolean;
  popularity?: number;
  installed?: boolean;
}

export const servers: MCPServer[] = [
  { id: "gh", name: "GitHub", description: "Repos, issues, PRs, actions", status: "online", capabilities: 42, latencyMs: 84, version: "1.4.2", icon: Github, color: "oklch(0.72 0.02 260)", verified: true, popularity: 98, installed: true },
  { id: "slack", name: "Slack", description: "Channels, DMs, threads", status: "online", capabilities: 21, latencyMs: 112, version: "0.9.7", icon: Slack, color: "oklch(0.72 0.18 320)", verified: true, popularity: 91, installed: true },
  { id: "pg", name: "Postgres", description: "SQL queries and schema", status: "online", capabilities: 18, latencyMs: 22, version: "2.0.1", icon: Database, color: "oklch(0.72 0.17 240)", verified: true, popularity: 88, installed: true },
  { id: "gmail", name: "Gmail", description: "Inbox, threads, drafts", status: "degraded", capabilities: 14, latencyMs: 341, version: "1.1.0", icon: Mail, color: "oklch(0.72 0.2 25)", verified: true, popularity: 84, installed: true },
  { id: "gcal", name: "Google Calendar", description: "Events, availability", status: "online", capabilities: 11, latencyMs: 96, version: "1.0.3", icon: Calendar, color: "oklch(0.72 0.17 155)", verified: true, popularity: 80, installed: true },
  { id: "notion", name: "Notion", description: "Pages, databases, blocks", status: "online", capabilities: 27, latencyMs: 145, version: "1.2.9", icon: FileText, color: "oklch(0.85 0.005 260)", verified: true, popularity: 87, installed: true },
  { id: "web", name: "Web Search", description: "Live web + citations", status: "online", capabilities: 6, latencyMs: 210, version: "0.8.1", icon: Search, color: "oklch(0.72 0.17 190)", verified: true, popularity: 76, installed: true },
  { id: "s3", name: "AWS S3", description: "Object storage", status: "offline", capabilities: 9, latencyMs: 0, version: "1.0.0", icon: Cloud, color: "oklch(0.82 0.16 85)", verified: true, popularity: 70, installed: true },
  { id: "linear", name: "Linear", description: "Issues, cycles, projects", status: "online", capabilities: 24, latencyMs: 78, version: "1.3.0", icon: Zap, color: "oklch(0.72 0.19 265)", verified: true, popularity: 89, installed: true },
  { id: "intercom", name: "Intercom", description: "Conversations & users", status: "online", capabilities: 15, latencyMs: 132, version: "0.7.2", icon: MessageSquare, color: "oklch(0.72 0.17 30)", verified: true, popularity: 65, installed: true },
  { id: "figma", name: "Figma", description: "Files, comments, exports", status: "online", capabilities: 12, latencyMs: 168, version: "0.5.4", icon: Figma, color: "oklch(0.72 0.2 300)", verified: true, popularity: 72, installed: true },
  { id: "browser", name: "Browser Agent", description: "Headless browsing", status: "online", capabilities: 8, latencyMs: 250, version: "0.4.0", icon: Chrome, color: "oklch(0.72 0.17 220)", verified: false, popularity: 60, installed: true },
];

export const marketplace: MCPServer[] = [
  { id: "jira", name: "Jira", description: "Enterprise issue tracker", status: "online", capabilities: 32, latencyMs: 140, version: "2.1.0", icon: Zap, color: "oklch(0.72 0.19 250)", verified: true, popularity: 82, installed: false },
  { id: "stripe", name: "Stripe", description: "Payments, subscriptions, invoices", status: "online", capabilities: 40, latencyMs: 88, version: "3.2.1", icon: Database, color: "oklch(0.7 0.22 300)", verified: true, popularity: 94, installed: false },
  { id: "hubspot", name: "HubSpot", description: "CRM contacts + deals", status: "online", capabilities: 28, latencyMs: 200, version: "1.6.0", icon: MessageSquare, color: "oklch(0.72 0.2 30)", verified: true, popularity: 78, installed: false },
  { id: "sentry", name: "Sentry", description: "Errors and traces", status: "online", capabilities: 19, latencyMs: 110, version: "1.0.4", icon: Zap, color: "oklch(0.7 0.22 350)", verified: true, popularity: 74, installed: false },
];

export interface Capability {
  id: string;
  name: string;
  server: string;
  category: string;
  tags: string[];
  score: number;
  description: string;
}

export const capabilities: Capability[] = [
  { id: "c1", name: "search_issues", server: "GitHub", category: "Development", tags: ["query", "read"], score: 0.98, description: "Search issues across repositories" },
  { id: "c2", name: "create_pr", server: "GitHub", category: "Development", tags: ["write"], score: 0.96, description: "Open a pull request from a branch" },
  { id: "c3", name: "post_message", server: "Slack", category: "Comms", tags: ["write"], score: 0.94, description: "Send a message to a channel or DM" },
  { id: "c4", name: "run_query", server: "Postgres", category: "Data", tags: ["read"], score: 0.99, description: "Execute a parameterized SQL query" },
  { id: "c5", name: "list_events", server: "Google Calendar", category: "Productivity", tags: ["read"], score: 0.9, description: "List events in a date range" },
  { id: "c6", name: "create_page", server: "Notion", category: "Docs", tags: ["write"], score: 0.92, description: "Create a Notion page from template" },
  { id: "c7", name: "web_search", server: "Web Search", category: "Research", tags: ["read"], score: 0.88, description: "Real-time web search with citations" },
  { id: "c8", name: "send_email", server: "Gmail", category: "Comms", tags: ["write"], score: 0.85, description: "Compose and send an email" },
  { id: "c9", name: "get_file_versions", server: "Figma", category: "Design", tags: ["read"], score: 0.83, description: "Return design file versions" },
  { id: "c10", name: "list_issues", server: "Linear", category: "PM", tags: ["read"], score: 0.91, description: "List issues by project or cycle" },
];