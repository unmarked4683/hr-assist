"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarRow } from "./CalendarRow";
import { AttendanceStatus } from "./types";
import { useHolidays } from "@/hooks/use-holidays";
import { polishName } from "@/app/(dashboard)/holidays/holidays-translations";

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
  year: number;
  month: number;
  attendanceByDate: Map<string, AttendanceStatus>;
  scrollToTodaySignal: number;
}

export function CalendarTable({
  year,
  month,
  attendanceByDate,
  scrollToTodaySignal,
}: CalendarTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRowRef = useRef<HTMLTableRowElement>(null);

  // Pobieramy święta raz dla całego kalendarza za pomocą React Query hooka
  const { data: holidays = [] } = useHolidays();

  // Tworzymy mapę O(1) z polskimi nazwami świąt, odświeżaną tylko po zmianie danych z API
  const holidaysMap = useMemo(() => {
    const map = new Map<string, string>();
    holidays.forEach((h) => {
      map.set(h.date, polishName(h.name)); // h.date to np. "2026-01-06"
    });
    return map;
  }, [holidays]);

  const monthStart = useMemo(
    () => startOfMonth(new Date(year, month, 1)),
    [year, month],
  );
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);

  const days = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  const today = useMemo(() => new Date(), []);
  const isCurrentMonth = isSameMonth(monthStart, today);
  const todayKey = format(today, "yyyy-MM-dd");

  useLayoutEffect(() => {
    if (!isCurrentMonth) return;

    todayRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [isCurrentMonth, days, scrollToTodaySignal]);

  return (
    <Card className="flex flex-1 min-h-0 flex-col overflow-hidden border border-border p-0 shadow-sm">
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto *:data-[slot=table-container]:overflow-visible"
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
            {days.map((date, index) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const isToday = isCurrentMonth && dateKey === todayKey;
              const isFuture = date.getTime() > today.getTime();

              return (
                <CalendarRow
                  key={dateKey}
                  ref={isToday ? todayRowRef : undefined}
                  date={date}
                  rawStatus={attendanceByDate.get(dateKey)}
                  isToday={isToday}
                  isFuture={isFuture}
                  rowIndex={index}
                  holidaysMap={holidaysMap}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
