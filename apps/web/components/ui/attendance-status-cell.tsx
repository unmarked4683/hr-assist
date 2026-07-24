import { cn } from "@/lib/utils";
import type { CalendarDisplayStatus } from "@/lib/types/attendance";

interface AttendanceStatusCellProps {
  status: CalendarDisplayStatus;
  className?: string;
}

const STATUS_STYLES: Record<CalendarDisplayStatus, string> = {
  OB: "text-status-ok",
  NN: "text-status-nn font-semibold",
  USP: "text-status-usp",
};

export function AttendanceStatusCell({
  status,
  className,
}: AttendanceStatusCellProps) {
  return (
    <span className={cn("text-sm", STATUS_STYLES[status], className)}>
      {status}
    </span>
  );
}
