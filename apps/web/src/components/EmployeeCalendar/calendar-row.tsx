import { forwardRef } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "./status-indicator";
import {
  AttendanceStatus,
  DEFAULT_SCHEDULE,
  NOMINAL_WORK_HOURS,
} from "./types";
import { cn } from "@/lib/utils";

interface CalendarRowProps {
  date: Date;
  rawStatus?: AttendanceStatus;
  isToday: boolean;
  isFuture: boolean;
  rowIndex: number;
}

export const CalendarRow = forwardRef<HTMLTableRowElement, CalendarRowProps>(
  ({ date, rawStatus, isToday, isFuture }, ref) => {
    const weekdayLabel = format(date, "EEEE", { locale: pl });
    const isUnexcused: boolean = rawStatus === "NN";

    return (
      <TableRow
        ref={ref}
        className={cn(
          "transition-colors",
          isToday && "bg-muted/50 font-medium",
          isUnexcused && "bg-destructive/10",
        )}
      >
        <TableCell className="font-medium">
          {format(date, "d MMMM yyyy", { locale: pl })}
        </TableCell>
        <TableCell className="capitalize text-muted-foreground">
          {weekdayLabel}
        </TableCell>
        <TableCell>
          <div
            className={cn(
              isUnexcused && "inline-block animate-pulse duration-1000",
            )}
          >
            <StatusIndicator status={rawStatus ?? null} />
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {isFuture
            ? "—"
            : `${DEFAULT_SCHEDULE.start} - ${DEFAULT_SCHEDULE.end}`}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {isFuture ? "—" : `${NOMINAL_WORK_HOURS}h`}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {isFuture ? "—" : isUnexcused ? "0h" : `${NOMINAL_WORK_HOURS}h`}
        </TableCell>
      </TableRow>
    );
  },
);

CalendarRow.displayName = "CalendarRow";
