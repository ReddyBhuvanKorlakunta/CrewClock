import { cn } from "../utils";

interface ShiftChipProps {
  startTime: string;
  endTime: string;
  role: string;
  color?: string;
  isOpen?: boolean;
  className?: string;
}

export function ShiftChip({ startTime, endTime, role, color = "#3b82f6", isOpen, className }: ShiftChipProps) {
  return (
    <div
      className={cn("flex min-h-[52px] flex-col justify-center rounded-lg border-l-4 bg-card px-3 py-2 text-xs shadow-sm", className)}
      style={{ borderLeftColor: color }}
    >
      <span className="font-semibold">{role}</span>
      <span className="text-muted-foreground">
        {startTime} – {endTime}
      </span>
      {isOpen && (
        <span className="mt-0.5 text-violet-600 dark:text-violet-400 font-medium">● Open shift</span>
      )}
    </div>
  );
}
