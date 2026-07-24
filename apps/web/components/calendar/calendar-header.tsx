"use client";

import { Lock, LockOpen } from "lucide-react";

import { DateControls } from "@/components/calendar/date-controls";
import { Button } from "@/components/ui/button";
import type { MonthLockInfo } from "@/lib/utils/month-lock";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  year: number;
  month: number;
  lockInfo: MonthLockInfo;
  onPrevious: () => void;
  onNext: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onLockClick: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function CalendarHeader({
  year,
  month,
  lockInfo,
  onPrevious,
  onNext,
  onMonthChange,
  onYearChange,
  onLockClick,
  canGoPrevious,
  canGoNext,
}: CalendarHeaderProps) {
  const lockIconClass = cn(
    lockInfo.iconVariant === "active-green" && "text-green-600",
    lockInfo.iconVariant === "locked-red" && "text-destructive",
    lockInfo.iconVariant === "disabled" && "text-muted-foreground",
  );

  const LockIcon = lockInfo.isLocked ? Lock : LockOpen;

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3">
      <DateControls
        year={year}
        month={month}
        onPrevious={onPrevious}
        onNext={onNext}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onLockClick}
        disabled={!lockInfo.canManualLock}
        aria-label="Blokada miesiąca"
        title={lockInfo.tooltip}
      >
        <LockIcon className={cn("size-4", lockIconClass)} />
      </Button>
    </div>
  );
}
