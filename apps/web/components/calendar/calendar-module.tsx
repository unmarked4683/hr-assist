"use client";

import { useEffect, useMemo, useState } from "react";

import { AttendanceEditModal } from "@/components/calendar/attendance-edit-modal";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { Modal } from "@/components/modals/modal";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CONFIRM_LOCK_MESSAGE } from "@/lib/constants/calendar";
import type { AttendanceCode, CalendarDay, MonthCalendarData } from "@/lib/types/attendance";
import { resolveMonthLockState } from "@/lib/utils/month-lock";
import { cn } from "@/lib/utils";
import {
  deleteDayAttendance,
  getMonthCalendar,
  lockMonth,
  updateDayAttendance,
} from "@/services/attendance";

interface CalendarModuleProps {
  employeeId: string;
  className?: string;
}

export function CalendarModule({ employeeId, className }: CalendarModuleProps) {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calendarData, setCalendarData] = useState<MonthCalendarData | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLockConfirmOpen, setIsLockConfirmOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const refreshCalendar = () => setRefreshToken((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMonthCalendar(employeeId, year, month);
        if (!cancelled) {
          setCalendarData(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Nie udało się wczytać kalendarza",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [employeeId, month, year, refreshToken]);

  const lockInfo = resolveMonthLockState(year, month, now);

  const canGoPrevious = !(year === 2026 && month === 1);
  const canGoNext = !(year === 2036 && month === 12);

  const goPrevious = () => {
    if (!canGoPrevious) return;
    if (month === 1) {
      setYear((value) => value - 1);
      setMonth(12);
      return;
    }
    setMonth((value) => value - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (month === 12) {
      setYear((value) => value + 1);
      setMonth(1);
      return;
    }
    setMonth((value) => value + 1);
  };

  const handleLockConfirm = async () => {
    await lockMonth(employeeId, year, month);
    setIsLockConfirmOpen(false);
    refreshCalendar();
  };

  const handleUpdate = async (date: string, code: AttendanceCode) => {
    await updateDayAttendance(employeeId, date, code);
    refreshCalendar();
  };

  const handleDelete = async (date: string) => {
    await deleteDayAttendance(employeeId, date);
    refreshCalendar();
  };

  if (isLoading && !calendarData) {
    return (
      <section
        className={cn(
          "flex min-h-0 flex-1 items-center justify-center rounded-md border bg-card",
          className,
        )}
      >
        <LoadingSpinner label="Wczytywanie kalendarza..." />
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={cn(
          "flex min-h-0 flex-1 items-start rounded-md border bg-card p-4",
          className,
        )}
      >
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-card",
        className,
      )}
    >
      <CalendarHeader
        year={year}
        month={month}
        lockInfo={lockInfo}
        onPrevious={goPrevious}
        onNext={goNext}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onLockClick={() => setIsLockConfirmOpen(true)}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />

      {calendarData ? (
        <CalendarGrid
          days={calendarData.days}
          isLocked={calendarData.isLocked}
          onDayClick={(day) => {
            setSelectedDay(day);
            setIsModalOpen(true);
          }}
        />
      ) : null}

      <AttendanceEditModal
        day={selectedDay}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <Modal
        open={isLockConfirmOpen}
        onOpenChange={setIsLockConfirmOpen}
        title="Potwierdzenie blokady"
        primaryAction={{
          label: "Zablokuj",
          onClick: handleLockConfirm,
        }}
        confirmConfig={{
          title: "Potwierdzenie blokady",
          message: CONFIRM_LOCK_MESSAGE,
          onConfirm: handleLockConfirm,
        }}
      >
        <p className="text-sm text-muted-foreground">{CONFIRM_LOCK_MESSAGE}</p>
      </Modal>
    </section>
  );
}
