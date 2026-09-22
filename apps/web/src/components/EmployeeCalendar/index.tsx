"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { DateControls } from "./date-controls";
import { CalendarTable } from "./calendar-table";
import { CalendarRecord, AttendanceStatus } from "./types";
import { ApiService } from "@/services/api.service";
import { Absence } from "@/types";

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
    queryFn: async () => {
      const absences = await ApiService.getEmployeeAbsences(employeeId);
      const records: CalendarRecord[] = (
        Array.isArray(absences) ? absences : []
      ).map((item: Absence) => ({
        date: item.date,
        status: item.type as AttendanceStatus,
      }));

      return records;
    },
  });

  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    attendance?.forEach((record) => {
      if (record.date) {
        map.set(record.date.slice(0, 10), record.status);
      }
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
