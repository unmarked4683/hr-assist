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
import {
  CALENDAR_COLUMNS,
  type CalendarColumnId,
} from "@/lib/constants/calendar";
import type { CalendarDay } from "@/lib/types/attendance";
import { getDayEditability } from "@/lib/utils/calendar-editability";
import { cn } from "@/lib/utils";

const WEEKEND_PLACEHOLDER = "-";

const calendarTableClass = "table-fixed w-full border-separate border-spacing-0 text-sm";
const calendarHeaderClass =
  "bg-card px-3 py-3 text-sm font-semibold normal-case leading-snug tracking-normal whitespace-normal text-center align-middle";
const calendarCellClass = "px-3 py-3 text-sm text-center align-middle";

interface CalendarGridProps {
  days: CalendarDay[];
  isLocked: boolean;
  onDayClick: (day: CalendarDay) => void;
}

function CalendarColGroup() {
  return (
    <colgroup>
      {CALENDAR_COLUMNS.map((column) => (
        <col key={column.id} style={{ width: column.width }} />
      ))}
    </colgroup>
  );
}

function renderCalendarCell(
  day: CalendarDay,
  columnId: CalendarColumnId,
  isWeekendRow: boolean,
) {
  switch (columnId) {
    case "dayOfMonth":
      return day.dayOfMonth;
    case "weekday":
      return day.weekdayLabel;
    case "workHours":
      return isWeekendRow ? WEEKEND_PLACEHOLDER : day.workHours;
    case "nominalTime":
      return isWeekendRow ? WEEKEND_PLACEHOLDER : day.nominalTime;
    case "realTime":
      return isWeekendRow ? WEEKEND_PLACEHOLDER : day.realTime;
    case "status":
      return isWeekendRow ? (
        WEEKEND_PLACEHOLDER
      ) : (
        <AttendanceStatusCell status={day.displayStatus} />
      );
  }
}

export function CalendarGrid({ days, isLocked, onDayClick }: CalendarGridProps) {
  return (
    <div
      className={cn(
        "grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-card",
        isLocked && "pointer-events-none cursor-not-allowed opacity-50",
      )}
    >
      <div className="overflow-hidden border-b bg-card">
        <DataTable className={calendarTableClass}>
          <CalendarColGroup />
          <DataTableHead className="static bg-card [&_th]:bg-card">
            <tr>
              {CALENDAR_COLUMNS.map((column) => (
                <DataTableHeaderCell
                  key={column.id}
                  className={cn(calendarHeaderClass, column.headerClassName)}
                >
                  {column.header}
                </DataTableHeaderCell>
              ))}
            </tr>
          </DataTableHead>
        </DataTable>
      </div>

      <div className="min-h-0 overflow-y-auto overscroll-contain bg-card scrollbar-gutter-stable">
        <DataTable className={calendarTableClass}>
          <CalendarColGroup />
          <DataTableBody>
            {days.map((day) => {
              const editability = getDayEditability(day, isLocked);
              const isWeekendRow = day.isWeekend;
              return (
                <DataTableRow
                  key={day.date}
                  onClick={() => {
                    if (editability.editable) onDayClick(day);
                  }}
                  className={cn(
                    isWeekendRow && "text-muted-foreground",
                    day.displayStatus === "NN" && !isWeekendRow && "pulse-nn",
                    editability.editable
                      ? "cursor-pointer hover:bg-muted/60"
                      : "cursor-not-allowed",
                  )}
                >
                  {CALENDAR_COLUMNS.map((column) => (
                    <DataTableCell
                      key={column.id}
                      className={cn(calendarCellClass, column.cellClassName)}
                    >
                      {renderCalendarCell(day, column.id, isWeekendRow)}
                    </DataTableCell>
                  ))}
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      </div>
    </div>
  );
}
