"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTH_NAMES } from "@/utils/calendar.types";
import { CalendarPeriod } from "@/utils/month.utils";

// Przyciski shadcn przesuwają się o 1px przy kliknięciu — w kontrolkach dat to
// wygląda jak "skok", więc wyłączamy to przesunięcie.
const STABLE_BUTTON_CLASS = "active:not-aria-[haspopup]:translate-y-0";

const buildYearOptions = (firstYear: number, lastYear: number): number[] =>
  Array.from(
    { length: Math.max(lastYear - firstYear + 1, 1) },
    (_, index) => firstYear + index,
  );

interface DateControlsProps {
  month: number; // 1-12
  year: number;
  /** Najwcześniejszy dostępny miesiąc (1-12) — wcześniejsze są zablokowane. */
  minPeriod: CalendarPeriod;
  /** Najpóźniejszy dostępny miesiąc (1-12) — późniejsze są zablokowane. */
  maxPeriod: CalendarPeriod;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function DateControls({
  month,
  year,
  minPeriod,
  maxPeriod,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onToday,
}: DateControlsProps) {
  const yearOptions = buildYearOptions(minPeriod.year, maxPeriod.year);
  const isAtMinPeriod =
    year < minPeriod.year ||
    (year === minPeriod.year && month <= minPeriod.month);

  const isAtMaxPeriod =
    year > maxPeriod.year ||
    (year === maxPeriod.year && month >= maxPeriod.month);

  const isMonthOutOfRange = (monthOption: number): boolean =>
    (year === minPeriod.year && monthOption < minPeriod.month) ||
    (year === maxPeriod.year && monthOption > maxPeriod.month);

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevMonth}
        disabled={isAtMinPeriod}
        className={STABLE_BUTTON_CLASS}
        aria-label="Poprzedni miesiąc"
      >
        <ChevronLeft />
      </Button>

      <Select
        value={month.toString()}
        onValueChange={(value) => onMonthChange(Number(value))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Miesiąc">
            {MONTH_NAMES[month - 1]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {/* Miesiące w zakresie 1-12, a MONTH_NAMES indeksowane od 0 */}
          {MONTH_NAMES.map((name, index) => {
            const monthOption = index + 1;

            return (
              <SelectItem
                key={name}
                value={monthOption.toString()}
                disabled={isMonthOutOfRange(monthOption)}
              >
                {name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select
        value={year.toString()}
        onValueChange={(value) => onYearChange(Number(value))}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Rok">{year}</SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {yearOptions.map((yearOption) => (
            <SelectItem key={yearOption} value={yearOption.toString()}>
              {yearOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
        disabled={isAtMaxPeriod}
        className={STABLE_BUTTON_CLASS}
        aria-label="Następny miesiąc"
      >
        <ChevronRight />
      </Button>

      <Button
        variant="outline-primary"
        onClick={onToday}
        className={STABLE_BUTTON_CLASS}
      >
        Dziś
      </Button>
    </div>
  );
}
