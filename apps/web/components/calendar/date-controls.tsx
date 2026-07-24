"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface DateControlsProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function DateControls({
  year,
  month,
  onPrevious,
  onNext,
  onMonthChange,
  onYearChange,
  canGoPrevious,
  canGoNext,
}: DateControlsProps) {
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const years = Array.from(
    { length: CALENDAR_YEAR_MAX - CALENDAR_YEAR_MIN + 1 },
    (_, index) => CALENDAR_YEAR_MIN + index,
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest("[data-slot='select-content'], [role='listbox']")
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      if (!canGoPrevious) return;
      event.preventDefault();
      onPrevious();
      previousButtonRef.current?.focus();
      return;
    }

    if (!canGoNext) return;
    event.preventDefault();
    onNext();
    nextButtonRef.current?.focus();
  };

  return (
    <div
      className="flex items-center gap-2 outline-none focus-visible:ring-0"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.focus();
        }
      }}
    >
      <Button
        ref={previousButtonRef}
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
        ref={nextButtonRef}
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
  );
}
