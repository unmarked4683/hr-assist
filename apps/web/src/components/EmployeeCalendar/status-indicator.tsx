import { cn } from "@/lib/utils";
import { AttendanceStatus, STATUS_PRESENTATION } from "./types";

interface StatusIndicatorProps {
  status: AttendanceStatus | null;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  if (!status) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>—</span>
    );
  }

  const presentation = STATUS_PRESENTATION[status] || {
    code: status,
    label: status,
    dotClassName: "bg-muted-foreground",
    textClassName: "text-muted-foreground",
  };

  return (
    <span
      title={presentation.label}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        presentation.textClassName,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          presentation.dotClassName,
        )}
      />
      {presentation.code}
    </span>
  );
}
