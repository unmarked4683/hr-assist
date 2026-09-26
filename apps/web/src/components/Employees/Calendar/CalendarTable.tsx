"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfToday,
} from "date-fns";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarRow } from "./CalendarRow";
import { AttendanceStatus } from "@/utils/calendar.types";
import { useHolidays } from "@/hooks/use-holidays";
import { polishName } from "@/app/(dashboard)/holidays/holidays-translations";
import { calendarLog } from "@/utils/debug.utils";
import { periodStartDate } from "@/utils/month.utils";
import {
  CalendarDayState,
  describeCalendarDay,
  WorkScheduleInfo,
} from "@/utils/day.utils";

const COLUMNS = [
  "Data",
  "Dzień tygodnia",
  "Status",
  "Przedział pracy",
  "Godziny nominalne",
  "Godziny realne",
] as const;

const COLUMN_WIDTHS = [
  "w-[18%]",
  "w-[14%]",
  "w-[14%]",
  "w-[22%]",
  "w-[16%]",
  "w-[16%]",
];

interface CalendarTableProps {
  employeeId: string;
  year: number;
  month: number; // oczekiwane 1-12
  attendanceByDate: Map<string, AttendanceStatus>;
  schedule: WorkScheduleInfo;
  /** Dni przed tą datą są zablokowane i puste ("—"). */
  hireDate: Date | null;
  scrollToTodaySignal: number;
}

interface CalendarDayEntry {
  date: Date;
  dateKey: string;
  holidayName: string | null;
  state: CalendarDayState;
}

interface MonthHoursTotals {
  nominal: number;
  /** null — żaden dzień nie ma jeszcze godzin realnych (np. przyszły miesiąc). */
  real: number | null;
}

/** Suma godzin miesiąca — liczona z tych samych stanów dni, które widać w wierszach. */
const sumMonthHours = (entries: CalendarDayEntry[]): MonthHoursTotals =>
  entries.reduce<MonthHoursTotals>(
    (totals, { state }) => ({
      nominal: totals.nominal + (state.nominalHours ?? 0),
      real:
        state.realHours === null
          ? totals.real
          : (totals.real ?? 0) + state.realHours,
    }),
    { nominal: 0, real: null },
  );

export function CalendarTable({
  employeeId,
  year,
  month,
  attendanceByDate,
  schedule,
  hireDate,
  scrollToTodaySignal,
}: CalendarTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRowRef = useRef<HTMLTableRowElement>(null);

  const { data: holidays = [] } = useHolidays();

  const holidaysMap = useMemo(() => {
    const map = new Map<string, string>();
    holidays.forEach((h) => {
      map.set(h.date, polishName(h.name));
    });
    return map;
  }, [holidays]);

  const monthStart = useMemo(
    () => periodStartDate({ year, month }),
    [year, month],
  );

  const today = useMemo(() => startOfToday(), []);
  const isCurrentMonth = isSameMonth(monthStart, today);

  const entries = useMemo<CalendarDayEntry[]>(
    () =>
      eachDayOfInterval({ start: monthStart, end: endOfMonth(monthStart) }).map(
        (date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const holidayName = holidaysMap.get(dateKey) ?? null;
          const state = describeCalendarDay({
            date,
            today,
            rawStatus: attendanceByDate.get(dateKey),
            holidayName,
            workHours: schedule.workHours,
            hireDate,
          });

          return {
            date,
            dateKey,
            // Święto przed zatrudnieniem też jest tylko "—" — bez ŚUW i nazwy.
            holidayName: state.kind === "holiday" ? holidayName : null,
            state,
          };
        },
      ),
    [
      monthStart,
      holidaysMap,
      today,
      attendanceByDate,
      schedule.workHours,
      hireDate,
    ],
  );

  const totals = useMemo(() => sumMonthHours(entries), [entries]);

  useEffect(() => {
    calendarLog("table rendered", {
      year,
      month,
      firstDay: format(monthStart, "yyyy-MM-dd"),
      days: entries.length,
      records: attendanceByDate.size,
      nominalHours: totals.nominal,
      realHours: totals.real,
    });
  }, [year, month, monthStart, entries, attendanceByDate, totals]);

  useLayoutEffect(() => {
    if (!isCurrentMonth) return;

    todayRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [isCurrentMonth, monthStart, scrollToTodaySignal]);

  return (
    <Card className="flex flex-1 min-h-0 flex-col overflow-hidden border border-border p-0 shadow-sm">
      <div
        ref={scrollContainerRef}
        // Jedyny element przewijany w kalendarzu: nagłówek (sticky top-0 z TableHeader)
        // i stopka (sticky bottom-0) trzymają się jego krawędzi. overscroll-y-none
        // wyłącza "gumowe" odbicie, które przesuwało nagłówek/stopkę na granicach.
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-none *:data-[slot=table-container]:overflow-visible"
      >
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((label, index) => (
                <TableHead key={label} className={COLUMN_WIDTHS[index]}>
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(({ date, dateKey, holidayName, state }) => {
              const isToday = isSameDay(date, today);

              return (
                <CalendarRow
                  key={dateKey}
                  ref={isToday ? todayRowRef : undefined}
                  employeeId={employeeId}
                  date={date}
                  isToday={isToday}
                  holidayName={holidayName}
                  dayState={state}
                  schedule={schedule}
                />
              );
            })}
          </TableBody>
          {/* Linia nad stopką jako cień komórek, nie border — przy border-collapse
              obramowanie nie "jedzie" razem z elementem sticky (jak w TableHead) */}
          <TableFooter className="sticky bottom-0 z-10 border-t-0 bg-muted [&_td]:shadow-[inset_0_1px_0_0_var(--border)]">
            {/* Jedna komórka na kolumnę — stopka trzyma układ nagłówka (COLUMN_WIDTHS) */}
            <TableRow>
              <TableCell className={cn(COLUMN_WIDTHS[0], "font-bold uppercase tracking-wide")}>
                Suma miesiąca
              </TableCell>
              <TableCell className={COLUMN_WIDTHS[1]} />
              <TableCell className={COLUMN_WIDTHS[2]} />
              <TableCell className={COLUMN_WIDTHS[3]} />
              <TableCell
                className={cn(COLUMN_WIDTHS[4], "font-bold")}
                title="Wszystkie dni robocze miesiąca według harmonogramu (bez weekendów i świąt)"
              >
                {totals.nominal}h
              </TableCell>
              <TableCell
                className={cn(COLUMN_WIDTHS[5], "font-bold")}
                title="Tylko dni obecności (OB) do dziś — urlopy, L4 i inne nieobecności liczą się jako 0h; „—”, dopóki żaden dzień nie ma godzin realnych"
              >
                {totals.real === null ? "—" : `${totals.real}h`}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
}
