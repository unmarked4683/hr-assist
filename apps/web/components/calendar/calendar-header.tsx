"use client";

import { ChevronLeft, ChevronRight, Lock, LockOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  POLISH_MONTHS,
} from "@/lib/constants/calendar";
import { getMonthLabel } from "@/lib/utils/date";
import type { MonthLockInfo } from "@/lib/utils/month-lock";
import { cn } from "@/lib/utils";

const calendarSelectContentProps = {
  side: "bottom" as const,
  sideOffset: 0,
  align: "start" as const,
  alignItemWithTrigger: false,
  className: "min-w-0 w-(--anchor-width) max-w-(--anchor-width)",
};

const calendarMonthSelectTriggerClass =
  "w-36 shrink-0 *:data-[slot=select-value]:line-clamp-none";

const calendarYearSelectTriggerClass =
  "w-20 shrink-0 tabular-nums *:data-[slot=select-value]:line-clamp-none";

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
  const years = Array.from(
    { length: CALENDAR_YEAR_MAX - CALENDAR_YEAR_MIN + 1 },
    (_, index) => CALENDAR_YEAR_MIN + index,
  );

  const lockIconClass = cn(
    lockInfo.iconVariant === "active-green" && "text-green-600",
    lockInfo.iconVariant === "locked-red" && "text-destructive",
    lockInfo.iconVariant === "disabled" && "text-muted-foreground",
  );

  const LockIcon = lockInfo.isLocked ? Lock : LockOpen;

  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Poprzedni miesiąc"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Select
          value={String(month)}
          onValueChange={(value) => onMonthChange(Number(value))}
        >
          <SelectTrigger className={calendarMonthSelectTriggerClass}>
            <SelectValue>{getMonthLabel(month)}</SelectValue>
          </SelectTrigger>
          <SelectContent {...calendarSelectContentProps}>
            {POLISH_MONTHS.map((label, index) => (
              <SelectItem key={label} value={String(index + 1)}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(year)}
          onValueChange={(value) => onYearChange(Number(value))}
        >
          <SelectTrigger className={calendarYearSelectTriggerClass}>
            <SelectValue>{year}</SelectValue>
          </SelectTrigger>
          <SelectContent {...calendarSelectContentProps}>
            {years.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Następny miesiąc"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

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
