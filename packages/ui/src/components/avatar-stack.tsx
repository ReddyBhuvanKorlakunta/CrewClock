import { cn } from "../utils";

interface AvatarItem {
  name: string;
  imageUrl?: string;
}

interface AvatarStackProps {
  items: AvatarItem[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function AvatarStack({ items, max = 4, size = "md", className }: AvatarStackProps) {
  const shown = items.slice(0, max);
  const rest = items.length - max;
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";

  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((item, i) => (
        <div
          key={i}
          title={item.name}
          className={cn("flex items-center justify-center rounded-full border-2 border-background bg-brand-100 font-semibold uppercase text-brand-700 ring-0", dim)}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="rounded-full object-cover w-full h-full" />
          ) : (
            item.name.slice(0, 2)
          )}
        </div>
      ))}
      {rest > 0 && (
        <div className={cn("flex items-center justify-center rounded-full border-2 border-background bg-muted font-semibold text-muted-foreground", dim)}>
          +{rest}
        </div>
      )}
    </div>
  );
}
