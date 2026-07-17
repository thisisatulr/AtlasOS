import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  spark,
  index = 0,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  spark?: number[];
  index?: number;
}) {
  const arr = spark ?? [4, 6, 5, 8, 7, 10, 9, 12, 11, 14];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const points = arr
    .map((v, i) => `${(i / (arr.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26 - 2}`)
    .join(" ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md transition hover:border-primary/40"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
          {delta && (
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-[color:var(--success)]">
              <ArrowUpRight className="h-3 w-3" /> {delta}
            </div>
          )}
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/70 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-3 h-10 w-full">
        <defs>
          <linearGradient id={`g${index}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 265)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 265)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke="oklch(0.72 0.19 265)" strokeWidth="1.5" />
        <polygon points={`0,30 ${points} 100,30`} fill={`url(#g${index})`} />
      </svg>
    </motion.div>
  );
}