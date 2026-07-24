import { cn } from "@/lib/utils";
import type { EmployeeStatus } from "@/lib/types/employee";

interface StatusIndicatorProps {
  status: EmployeeStatus;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const isOk = status === "OK";

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium", className)}>
      <span
        className={cn(
          "size-2.5 rounded-full",
          isOk ? "bg-status-ok" : "bg-status-nn",
        )}
        aria-hidden
      />
      {status}
    </span>
  );
}
