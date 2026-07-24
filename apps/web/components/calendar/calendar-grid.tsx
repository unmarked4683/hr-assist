"use client";

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/data-table";
import { AttendanceStatusCell } from "@/components/ui/attendance-status-cell";
import { StickyTableContainer } from "@/components/ui/sticky-table-container";
import { CALENDAR_COLUMN_HEADERS } from "@/lib/constants/calendar";
import type { CalendarDay } from "@/lib/types/attendance";
import { getDayEditability } from "@/lib/utils/calendar-editability";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  days: CalendarDay[];
  isLocked: boolean;
  onDayClick: (day: CalendarDay) => void;
}

export function CalendarGrid({ days, isLocked, onDayClick }: CalendarGridProps) {
  return (
    <StickyTableContainer
      className={cn(
        "border-0",
        isLocked && "pointer-events-none cursor-not-allowed opacity-50",
      )}
    >
      <DataTable>
        <DataTableHead>
          <tr>
            {CALENDAR_COLUMN_HEADERS.map((header) => (
              <DataTableHeaderCell key={header}>{header}</DataTableHeaderCell>
            ))}
          </tr>
        </DataTableHead>
        <DataTableBody>
          {days.map((day) => {
            const editability = getDayEditability(day, isLocked);
            return (
              <DataTableRow
                key={day.date}
                onClick={() => {
                  if (editability.editable) onDayClick(day);
                }}
                className={cn(
                  day.displayStatus === "NN" && "pulse-nn",
                  editability.editable
                    ? "cursor-pointer hover:bg-muted/60"
                    : "cursor-not-allowed",
                )}
              >
                <DataTableCell>{day.dayOfMonth}</DataTableCell>
                <DataTableCell>{day.weekdayLabel}</DataTableCell>
                <DataTableCell>{day.workHours}</DataTableCell>
                <DataTableCell>{day.nominalTime}</DataTableCell>
                <DataTableCell>{day.realTime}</DataTableCell>
                <DataTableCell>
                  <AttendanceStatusCell status={day.displayStatus} />
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>
    </StickyTableContainer>
  );
}
