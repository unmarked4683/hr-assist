import { forwardRef, useState } from "react";
import { format, isWeekend } from "date-fns";
import { pl } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "./StatusIndicator";
import {
  AttendanceStatus,
  DEFAULT_SCHEDULE,
  NOMINAL_WORK_HOURS,
} from "./types";
import { cn } from "@/lib/utils";
import { AttendanceModal } from "./AttendanceModal";

interface CalendarRowProps {
  date: Date;
  rawStatus?: AttendanceStatus;
  isToday: boolean;
  isFuture: boolean;
  rowIndex: number;
  holidaysMap?: Map<string, string>; // Przyjmuje gotową mapę o złożoności O(1)
}

export const CalendarRow = forwardRef<HTMLTableRowElement, CalendarRowProps>(
  ({ date, rawStatus, isToday, isFuture, holidaysMap = new Map() }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const weekdayLabel = format(date, "EEEE", { locale: pl });
    const weekend = isWeekend(date);

    // Błyskawiczne sprawdzenie O(1) w mapie po formacie YYYY-MM-DD
    const formattedDateString = format(date, "yyyy-MM-dd");
    const holidayName = holidaysMap.get(formattedDateString) || null;

    // Święto, weekend lub przyszłość blokują edycję
    const isDisabled = weekend || isFuture || Boolean(holidayName);

    // Dni robocze z przeszłości/dzisiaj bez statusu to domyślnie OB (chyba że to święto)
    const effectiveStatus: AttendanceStatus | null = holidayName
      ? null
      : weekend || isFuture
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
              ? "opacity-60 cursor-not-allowed bg-muted/20"
              : "cursor-pointer hover:bg-muted/40",
            isToday && "bg-muted/50 font-medium",
            isUnexcused && "bg-destructive/10",
          )}
        >
          {/* Polska data bez wiodącego zera, np. "6 stycznia 2026" */}
          <TableCell className="font-medium">
            {format(date, "d MMMM yyyy", { locale: pl })}
          </TableCell>
          <TableCell className="capitalize text-muted-foreground">
            {weekdayLabel}
          </TableCell>
          <TableCell>
            {holidayName ? (
              <span
                title="Święto ustawowo wolne"
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 cursor-help"
              >
                ŚUW
              </span>
            ) : (
              <div
                className={cn(
                  isUnexcused && "inline-block animate-pulse duration-1000",
                )}
              >
                <StatusIndicator status={effectiveStatus} />
              </div>
            )}
          </TableCell>

          {/* Bezpieczne scalanie kolumn przy święcie z colSpan={3} */}
          {holidayName ? (
            <TableCell
              colSpan={3}
              className="text-center font-medium text-muted-foreground bg-muted/10 italic"
            >
              {holidayName}
            </TableCell>
          ) : (
            <>
              <TableCell className="text-muted-foreground">
                {isDisabled
                  ? "—"
                  : `${DEFAULT_SCHEDULE.start} - ${DEFAULT_SCHEDULE.end}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isDisabled ? "—" : `${NOMINAL_WORK_HOURS}h`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isDisabled
                  ? "—"
                  : isUnexcused
                    ? "0h"
                    : `${NOMINAL_WORK_HOURS}h`}
              </TableCell>
            </>
          )}
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
