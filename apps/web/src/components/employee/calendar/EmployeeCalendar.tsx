"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { DateControls } from "./DateControls";
import { CalendarTable } from "./CalendarTable";
import { CalendarRecord, AttendanceStatus } from "./types";
import { ApiService } from "@/services/api.service";
import { Absence } from "@/types";
import { QueryKeysService } from "@/services/query-keys.service";

interface EmployeeCalendarProps {
  employeeId: string;
}

export function EmployeeCalendar({ employeeId }: EmployeeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(() => today.getFullYear());
  // Miesiące od razu w zakresie 1-12 (np. styczeń = 1, wrzesień = 9)
  const [month, setMonth] = useState(() => today.getMonth() + 1);
  const [scrollToTodaySignal, setScrollToTodaySignal] = useState(0);

  const {
    data: attendance,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QueryKeysService.attendancePerMonth({
      employeeId,
      year,
      month, // Wędruje wprost 1-12
    }),
    queryFn: async () => {
      const absences = await ApiService.getEmployeeAbsencesByMonth(
        employeeId,
        year,
        month,
      );
      const records: CalendarRecord[] = (
        Array.isArray(absences) ? absences : []
      ).map((item: Absence) => ({
        date: item.date,
        status: item.type as AttendanceStatus,
      }));

      return records;
    },
    enabled: !!employeeId,
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
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
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
          employeeId={employeeId}
          year={year}
          month={month} // Przekazujemy czyste 1-12
          attendanceByDate={attendanceByDate}
          scrollToTodaySignal={scrollToTodaySignal}
        />
      )}
    </div>
  );
}
