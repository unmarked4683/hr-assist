"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { DateControls } from "./DateControls";
import { CalendarTable } from "./CalendarTable";
import { CalendarRecord, AttendanceStatus } from "@/utils/calendar.types";
import { ApiService } from "@/services/api.service";
import { Absence } from "@/types";
import { QueryKeysService } from "@/services/query-keys.service";
import { calendarLog } from "@/utils/debug.utils";
import { parseDateOnly, WorkScheduleInfo } from "@/utils/day.utils";
import {
  clampPeriod,
  getMaxCalendarPeriod,
  getMinCalendarPeriod,
  shiftPeriod,
  toCalendarPeriod,
} from "@/utils/month.utils";

interface EmployeeCalendarProps {
  employeeId: string;
  /** Harmonogram pracownika — źródło godzin nominalnych i realnych. */
  schedule: WorkScheduleInfo;
  /** Data zatrudnienia z backendu (ISO) — dolna granica kalendarza. */
  employmentDate: string;
}

export function EmployeeCalendar({
  employeeId,
  schedule,
  employmentDate,
}: EmployeeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const hireDate = useMemo(() => parseDateOnly(employmentDate), [employmentDate]);
  // Miesiąc zatrudnienia, ale nie wcześniej niż start aplikacji (styczeń 2026).
  const minPeriod = useMemo(() => getMinCalendarPeriod(hireDate), [hireDate]);
  // Rok i miesiąc w jednym stanie — zmiana przez granicę roku (grudzień ↔ styczeń)
  // jest atomowa, a szybkie kliknięcia liczą się od najnowszej wartości, nie z domknięcia.
  // Miesiące w zakresie 1-12 (np. styczeń = 1, wrzesień = 9).
  // Każda zmiana przechodzi przez `clampPeriod` — zakres od miesiąca zatrudnienia
  // (min. start aplikacji) do grudnia roku bieżący + 5.
  const [{ year, month }, setPeriod] = useState(() =>
    clampPeriod(toCalendarPeriod(today), minPeriod),
  );
  const [scrollToTodaySignal, setScrollToTodaySignal] = useState(0);

  useEffect(() => {
    calendarLog("period changed", { employeeId, year, month });
  }, [employeeId, year, month]);

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
    // Parametry czytamy z klucza, a nie z domknięcia — zapytanie zawsze dotyczy
    // dokładnie tego miesiąca, pod którym zostanie zapisane w cache.
    // `signal` anuluje żądanie, gdy użytkownik przejdzie do innego miesiąca.
    queryFn: async ({ queryKey, signal }) => {
      const [, keyEmployeeId, , keyYear, keyMonth] = queryKey;
      calendarLog("request started", {
        employeeId: keyEmployeeId,
        year: keyYear,
        month: keyMonth,
      });

      signal.addEventListener("abort", () =>
        calendarLog("request cancelled", { year: keyYear, month: keyMonth }),
      );

      const absences = await ApiService.getEmployeeAbsencesByMonth(
        keyEmployeeId,
        keyYear,
        keyMonth,
        signal,
      );

      // Odrzucamy rekordy spoza żądanego miesiąca, żeby nie trafiły do złego widoku.
      const monthPrefix = `${keyYear}-${String(keyMonth).padStart(2, "0")}`;
      const items = Array.isArray(absences) ? absences : [];
      const records: CalendarRecord[] = items
        .filter((item: Absence) => item.date?.startsWith(monthPrefix))
        .map((item: Absence) => ({
          date: item.date,
          status: item.type as AttendanceStatus,
        }));

      calendarLog("response received", {
        year: keyYear,
        month: keyMonth,
        received: items.length,
        kept: records.length,
      });

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
    calendarLog("prev month clicked");
    setPeriod((prev) => shiftPeriod(prev, -1, minPeriod));
  };

  const goToNextMonth = () => {
    calendarLog("next month clicked");
    setPeriod((prev) => shiftPeriod(prev, 1, minPeriod));
  };

  const goToToday = () => {
    calendarLog("today clicked");
    setPeriod(clampPeriod(toCalendarPeriod(today), minPeriod));
    setScrollToTodaySignal((prev) => prev + 1);
  };

  const handleMonthChange = (nextMonth: number) => {
    calendarLog("month selected", { month: nextMonth });
    setPeriod((prev) => clampPeriod({ ...prev, month: nextMonth }, minPeriod));
  };

  // Po zmianie roku na rok zatrudnienia miesiąc sprzed zatrudnienia zostaje
  // przesunięty na pierwszy dozwolony.
  const handleYearChange = (nextYear: number) => {
    calendarLog("year selected", { year: nextYear });
    setPeriod((prev) => clampPeriod({ ...prev, year: nextYear }, minPeriod));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <DateControls
        month={month}
        year={year}
        minPeriod={minPeriod}
        maxPeriod={getMaxCalendarPeriod(today)}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
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
          schedule={schedule}
          hireDate={hireDate}
          scrollToTodaySignal={scrollToTodaySignal}
        />
      )}
    </div>
  );
}
