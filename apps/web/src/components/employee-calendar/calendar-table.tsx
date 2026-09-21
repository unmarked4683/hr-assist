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
import { CalendarRow } from "./calendar-row";
import { AttendanceStatus } from "./types";

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
}

export function CalendarTable({
  year,
  month,
  attendanceByDate,
}: CalendarTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRowRef = useRef<HTMLTableRowElement>(null);

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

    const container = scrollContainerRef.current;
    const todayRow = todayRowRef.current;
    if (!container || !todayRow) return;

    const targetScrollTop =
      todayRow.offsetTop -
      container.clientHeight / 2 +
      todayRow.clientHeight / 2;

    container.scrollTo({
      top: Math.max(targetScrollTop, 0),
      behavior: "smooth",
    });
  }, [isCurrentMonth, days]);

  return (
    <Card className="flex flex-1 min-h-0 flex-col overflow-hidden border border-border p-0 shadow-sm">
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto [&>[data-slot=table-container]]:overflow-visible"
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
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
