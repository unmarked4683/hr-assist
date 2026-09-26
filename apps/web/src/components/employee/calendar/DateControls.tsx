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
import { getYear } from "date-fns";
import { MONTH_NAMES } from "./types";
import { CalendarPeriod } from "./month.utils";

// Lista lat kończy się na roku następnym względem bieżącego.
const LAST_YEAR_OPTION = getYear(new Date()) + 1;

const buildYearOptions = (firstYear: number): number[] =>
  Array.from(
    { length: Math.max(LAST_YEAR_OPTION - firstYear + 1, 1) },
    (_, index) => firstYear + index,
  );

interface DateControlsProps {
  month: number; // 1-12
  year: number;
  /** Najwcześniejszy dostępny miesiąc (1-12) — wcześniejsze są zablokowane. */
  minPeriod: CalendarPeriod;
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
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onToday,
}: DateControlsProps) {
  const yearOptions = buildYearOptions(minPeriod.year);
  const isAtMinPeriod =
    year < minPeriod.year ||
    (year === minPeriod.year && month <= minPeriod.month);

  const isMonthBeforeMin = (monthOption: number): boolean =>
    year === minPeriod.year && monthOption < minPeriod.month;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevMonth}
        disabled={isAtMinPeriod}
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
                disabled={isMonthBeforeMin(monthOption)}
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
        aria-label="Następny miesiąc"
      >
        <ChevronRight />
      </Button>

      <Button variant="secondary" onClick={onToday}>
        Dziś
      </Button>
    </div>
  );
}
