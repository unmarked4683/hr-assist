import { LOCK_TOOLTIPS } from "@/lib/constants/calendar";
import type { MonthLockState } from "@/lib/types/attendance";

export interface MonthLockInfo {
  state: MonthLockState;
  isLocked: boolean;
  canManualLock: boolean;
  tooltip: string;
  iconVariant: "disabled" | "active-green" | "locked-red" | "unlocked";
}

export function resolveMonthLockState(
  viewedYear: number,
  viewedMonth: number,
  now: Date = new Date(),
  manuallyLockedMonths: Set<string> = new Set(),
): MonthLockInfo {
  const key = `${viewedYear}-${viewedMonth}`;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const isCurrentMonth =
    viewedYear === currentYear && viewedMonth === currentMonth;

  if (isCurrentMonth) {
    return {
      state: "current_month",
      isLocked: false,
      canManualLock: false,
      tooltip: LOCK_TOOLTIPS.currentMonth,
      iconVariant: "disabled",
    };
  }

  const viewedDate = new Date(viewedYear, viewedMonth - 1, 1);
  const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const nextMonthStart = new Date(currentYear, currentMonth, 1);

  const isPreviousMonth =
    viewedDate < currentMonthStart &&
    viewedDate >= new Date(currentYear, currentMonth - 2, 1);

  const isNextMonth =
    viewedDate.getTime() === nextMonthStart.getTime();

  if (manuallyLockedMonths.has(key)) {
    return {
      state: "system_locked",
      isLocked: true,
      canManualLock: false,
      tooltip: LOCK_TOOLTIPS.systemLocked,
      iconVariant: "locked-red",
    };
  }

  if (isNextMonth && currentDay >= 1 && currentDay <= 10) {
    return {
      state: "manual_window",
      isLocked: false,
      canManualLock: true,
      tooltip: LOCK_TOOLTIPS.manualWindow,
      iconVariant: "active-green",
    };
  }

  if (isPreviousMonth || (isNextMonth && currentDay >= 11)) {
    return {
      state: "system_locked",
      isLocked: true,
      canManualLock: false,
      tooltip: LOCK_TOOLTIPS.systemLocked,
      iconVariant: "locked-red",
    };
  }

  return {
    state: "unlocked",
    isLocked: false,
    canManualLock: false,
    tooltip: LOCK_TOOLTIPS.unlocked,
    iconVariant: "unlocked",
  };
}
