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
import { MONTH_NAMES } from "./types";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: 7 },
  (_, index) => CURRENT_YEAR - 5 + index,
);

interface DateControlsProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function DateControls({
  month,
  year,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onToday,
}: DateControlsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevMonth}
        aria-label="Poprzedni miesiąc"
      >
        <ChevronLeft />
      </Button>

      <Select
        value={month.toString()}
        onValueChange={(value) => onMonthChange(Number(value))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Miesiąc">{MONTH_NAMES[month]}</SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {MONTH_NAMES.map((name, index) => (
            <SelectItem key={name} value={index.toString()}>
              {name}
            </SelectItem>
          ))}
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
          {YEAR_OPTIONS.map((yearOption) => (
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
