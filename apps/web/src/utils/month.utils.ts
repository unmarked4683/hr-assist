import {
  addMonths,
  addYears,
  endOfYear,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  startOfMonth,
} from "date-fns";
import { APP_MAX_YEARS_AHEAD, APP_START_DATE } from "@/lib/constants";

/**
 * Miesiąc kalendarza w konwencji backendu i kluczy zapytań: 1-12 (styczeń = 1).
 * To JEDYNE miejsce, które przelicza go na/z 0-indeksowanych miesięcy `Date`.
 */
export interface CalendarPeriod {
  year: number;
  month: number; // 1-12
}

export const toCalendarPeriod = (date: Date): CalendarPeriod => ({
  year: getYear(date),
  month: getMonth(date) + 1,
});

export const periodStartDate = ({ year, month }: CalendarPeriod): Date =>
  startOfMonth(new Date(year, month - 1, 1));

/** Najwcześniejszy miesiąc dostępny w kalendarzu — wynika z daty startu aplikacji. */
export const MIN_CALENDAR_PERIOD: CalendarPeriod =
  toCalendarPeriod(APP_START_DATE);

export const isBeforeMinPeriod = (period: CalendarPeriod): boolean =>
  isBefore(periodStartDate(period), periodStartDate(MIN_CALENDAR_PERIOD));

/**
 * Najpóźniejszy miesiąc dostępny w kalendarzu: grudzień roku bieżący + 5
 * (np. we wrześniu 2026 → grudzień 2031). Liczony od dzisiejszej daty przy
 * każdym wywołaniu, więc po Nowym Roku limit przesuwa się sam.
 */
export const getMaxCalendarPeriod = (today: Date = new Date()): CalendarPeriod =>
  toCalendarPeriod(endOfYear(addYears(today, APP_MAX_YEARS_AHEAD)));

export const isAfterMaxPeriod = (period: CalendarPeriod): boolean =>
  isAfter(periodStartDate(period), periodStartDate(getMaxCalendarPeriod()));

/** Zwraca okres mieszczący się w zakresie `MIN_CALENDAR_PERIOD` – `getMaxCalendarPeriod()`. */
export const clampPeriod = (period: CalendarPeriod): CalendarPeriod => {
  if (isBeforeMinPeriod(period)) return MIN_CALENDAR_PERIOD;
  if (isAfterMaxPeriod(period)) return getMaxCalendarPeriod();
  return period;
};

/** Przesuwa okres o `delta` miesięcy — date-fns obsługuje przejście przez granicę roku. */
export const shiftPeriod = (
  period: CalendarPeriod,
  delta: number,
): CalendarPeriod =>
  clampPeriod(toCalendarPeriod(addMonths(periodStartDate(period), delta)));
