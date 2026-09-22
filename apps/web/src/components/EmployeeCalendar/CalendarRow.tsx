import { forwardRef, useState } from "react";
import { format, isWeekend } from "date-fns";
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
    const weekend = isWeekend(date);
    const isDisabled = weekend || isFuture;

    // Jeśli dzień nie jest w przyszłości ani weekendem, a status nie jest podany, domyślnie to OB (Obecność)
    const effectiveStatus: AttendanceStatus | null = isDisabled
      ? null
      : rawStatus || "OB";

    const isUnexcused = effectiveStatus === "NN";

    const handleRowClick = () => {
      if (isDisabled) return;
      setIsModalOpen(true);
    };

    const handleUpdateStatus = (newStatus: AttendanceStatus) => {
      console.log("Wysyłanie mutacji z nowym statusem:", newStatus);
    };

    return (
      <>
        <TableRow
          ref={ref}
          onClick={handleRowClick}
          className={cn(
            "transition-colors",
            isDisabled
              ? "opacity-50 cursor-not-allowed bg-muted/20"
              : "cursor-pointer hover:bg-muted/40",
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
              <StatusIndicator status={effectiveStatus} />
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground">
            {isDisabled
              ? "—"
              : `${DEFAULT_SCHEDULE.start} - ${DEFAULT_SCHEDULE.end}`}
          </TableCell>
          <TableCell className="text-muted-foreground">
            {isDisabled ? "—" : `${NOMINAL_WORK_HOURS}h`}
          </TableCell>
          <TableCell className="text-muted-foreground">
            {isDisabled ? "—" : isUnexcused ? "0h" : `${NOMINAL_WORK_HOURS}h`}
          </TableCell>
        </TableRow>

        {!isDisabled && (
          <AttendanceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            date={date}
            currentStatus={effectiveStatus}
            onUpdate={handleUpdateStatus}
          />
        )}
      </>
    );
  },
);

CalendarRow.displayName = "CalendarRow";
