import { forwardRef, useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  AttendanceStatus,
  DEFAULT_SCHEDULE,
  NOMINAL_WORK_HOURS,
} from "./types";
import { cn } from "@/lib/utils";
import { AttendanceModal } from "./AttendanceModal";
import { StatusIndicator } from "./StatusIndicator";

interface CalendarRowProps {
  date: Date;
  rawStatus?: AttendanceStatus;
  isToday: boolean;
  isFuture: boolean;
  rowIndex: number;
}

export const CalendarRow = forwardRef<HTMLTableRowElement, CalendarRowProps>(
  ({ date, rawStatus, isToday, isFuture }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const weekdayLabel = format(date, "EEEE", { locale: pl });
    const isUnexcused = rawStatus === "NN";

    const handleUpdateStatus = (newStatus: AttendanceStatus) => {
      console.log("Wysyłanie mutacji z nowym statusem:", newStatus);
    };

    return (
      <>
        <TableRow
          ref={ref}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "transition-colors cursor-pointer hover:bg-muted/40",
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

        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={date}
          currentStatus={rawStatus ?? null}
          onUpdate={handleUpdateStatus}
        />
      </>
    );
  },
);

CalendarRow.displayName = "CalendarRow";
