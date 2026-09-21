"use client";

import type { Ref } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "./status-indicator";
import { TodayMarker } from "./today-marker";
import {
  AttendanceStatus,
  DEFAULT_SCHEDULE,
  NOMINAL_WORK_HOURS,
} from "./types";

interface CalendarRowProps {
  date: Date;
  rawStatus: AttendanceStatus | undefined;
  isToday: boolean;
  isFuture: boolean;
  rowIndex: number;
  ref?: Ref<HTMLTableRowElement>;
}

export function CalendarRow({
  date,
  rawStatus,
  isToday,
  isFuture,
  rowIndex,
  ref,
}: CalendarRowProps) {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Reguła fallbacku: przyszłość bez wpisu -> brak statusu, przeszłość bez
  // wpisu -> domyślnie obecność. Weekendy nie mają statusu obecności.
  const status: AttendanceStatus | null = isWeekend
    ? null
    : (rawStatus ?? (isFuture ? null : "PRESENT"));

  const scheduleLabel = isWeekend
    ? "Wolne"
    : `${DEFAULT_SCHEDULE.start} - ${DEFAULT_SCHEDULE.end}`;

  const nominalHoursLabel = isWeekend ? "—" : `${NOMINAL_WORK_HOURS}h`;

  const actualHoursLabel = isWeekend
    ? "—"
    : status === null
      ? "—"
      : status === "PRESENT"
        ? `${NOMINAL_WORK_HOURS}h`
        : "0h";

  const isUnexcusedAbsence = status === "UNEXCUSED_ABSENCE";

  return (
    <TableRow
      ref={ref}
      data-today={isToday || undefined}
      className={cn(
        rowIndex % 2 === 1 && "bg-table-row-alt",
        isWeekend && "cursor-default bg-muted/20 text-muted-foreground/60",
        isUnexcusedAbsence && "animate-pulse bg-destructive/10",
      )}
    >
      <TableCell className="font-medium text-foreground">
        <span className="inline-flex items-center justify-center">
          {format(date, "d MMMM yyyy", { locale: pl })}
          {isToday && <TodayMarker />}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground capitalize">
        {format(date, "EEEE", { locale: pl }).toLowerCase()}
      </TableCell>
      <TableCell>
        <span className="inline-flex w-full items-center justify-center">
          <StatusIndicator status={status} />
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">{scheduleLabel}</TableCell>
      <TableCell className="text-muted-foreground">
        {nominalHoursLabel}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {actualHoursLabel}
      </TableCell>
    </TableRow>
  );
}
