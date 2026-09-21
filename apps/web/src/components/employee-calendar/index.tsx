"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { DateControls } from "./date-controls";
import { CalendarTable } from "./calendar-table";
import { getMockAttendance } from "./mock-data";
import { AttendanceStatus } from "./types";

interface EmployeeCalendarProps {
  employeeId: string;
}

export default function EmployeeCalendar({ employeeId }: EmployeeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(() => today.getFullYear());
  const [month, setMonth] = useState(() => today.getMonth());

  const {
    data: attendance,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee-attendance", employeeId, year, month],
    // ! TODO: API - Tutaj podmienisz wywołanie getMockAttendance na realny strzał do API (np. fetch / useQuery)
    queryFn: () => getMockAttendance(year, month + 1),
  });

  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    attendance?.forEach((record) => {
      map.set(record.date.slice(0, 10), record.status);
    });
    return map;
  }, [attendance]);

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  return (
    <div className="flex flex-col gap-4">
      <DateControls
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {isLoading ? (
        <div className="flex h-[480px] items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Ładowanie kalendarza...
        </div>
      ) : isError ? (
        <div className="flex h-[480px] items-center justify-center rounded-xl border border-border bg-card text-sm text-destructive">
          Błąd podczas ładowania kalendarza pracownika
        </div>
      ) : (
        <CalendarTable
          year={year}
          month={month}
          attendanceByDate={attendanceByDate}
        />
      )}
    </div>
  );
}
