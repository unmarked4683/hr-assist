"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { DateControls } from "./date-controls";
import { CalendarTable } from "./calendar-table";
import { getMockAttendance } from "./mock-data";
import { AttendanceStatus } from "./types";
import { ApiService } from "@/services/api.service";

interface EmployeeCalendarProps {
  employeeId: string;
}

export default function EmployeeCalendar({
  employeeId,
}: EmployeeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(() => today.getFullYear());
  const [month, setMonth] = useState(() => today.getMonth());
  const [scrollToTodaySignal, setScrollToTodaySignal] = useState(0);

  const {
    data: attendance,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employee-attendance", employeeId, year, month],
    // ! TODO: API - Tutaj podmienisz wywołanie getMockAttendance na realny strzał do API (np. fetch / useQuery)
    queryFn: async () => {
      const absences = await ApiService.getEmployeeAbsences(employeeId);
      console.log("ABSENCES", absences);
      return getMockAttendance(year, month + 1);
    },
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
    // Bump the signal so the calendar re-centers on today's row even when
    // we're already viewing the current month (e.g. after scrolling away).
    setScrollToTodaySignal((prev) => prev + 1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
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
        <div className="flex flex-1 min-h-0 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Ładowanie kalendarza...
        </div>
      ) : isError ? (
        <SectionErrorBlock
          title="Błąd kalendarza pracownika"
          description={error?.message || "Nie udało się załadować kalendarza."}
          onRetry={() => refetch()}
        />
      ) : (
        <CalendarTable
          year={year}
          month={month}
          attendanceByDate={attendanceByDate}
          scrollToTodaySignal={scrollToTodaySignal}
        />
      )}
    </div>
  );
}
