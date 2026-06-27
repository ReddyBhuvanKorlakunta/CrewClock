import { cn } from "../utils";

type Status = "active" | "inactive" | "pending" | "approved" | "rejected" | "draft" | "published" | "open" | "filled" | "completed" | "cancelled";

const STATUS_STYLES: Record<Status, string> = {
  active:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  inactive:  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  approved:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  rejected:  "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  draft:     "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  published: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  open:      "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400",
  filled:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[status], className)}>
      {status}
    </span>
  );
}
