import { motion } from "framer-motion";
import { cn } from "../utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({ title, value, delta, deltaPositive, icon: Icon, iconColor = "text-brand-600", className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {delta && (
            <p className={cn("text-xs font-medium", deltaPositive ? "text-emerald-600" : "text-red-500")}>
              {deltaPositive ? "↑" : "↓"} {delta}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl bg-brand-50 p-3 dark:bg-brand-950/30", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
