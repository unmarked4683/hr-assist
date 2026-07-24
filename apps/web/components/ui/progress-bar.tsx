import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <p className="text-xs text-muted-foreground">{label}</p>
      ) : null}
      <Progress value={safeValue} aria-label={label ?? "Postęp"} />
    </div>
  );
}
