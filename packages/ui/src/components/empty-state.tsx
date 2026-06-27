import type { LucideIcon } from "lucide-react";
import { cn } from "../utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-20 text-center", className)}>
      <div className="rounded-2xl bg-muted p-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-lg">{title}</p>
        {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
