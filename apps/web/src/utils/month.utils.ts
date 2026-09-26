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

/** Globalnie najwcześniejszy miesiąc kalendarza — wynika z daty startu aplikacji. */
export const MIN_CALENDAR_PERIOD: CalendarPeriod =
  toCalendarPeriod(APP_START_DATE);

/**
 * Najwcześniejszy miesiąc dla konkretnego pracownika: miesiąc zatrudnienia,
 * ale nigdy wcześniej niż start aplikacji (np. zatrudniony 16.09.2026 → wrzesień 2026).
 */
export const getMinCalendarPeriod = (hireDate: Date | null): CalendarPeriod =>
  hireDate && isAfter(hireDate, APP_START_DATE)
    ? toCalendarPeriod(hireDate)
    : MIN_CALENDAR_PERIOD;

export const isBeforeMinPeriod = (
  period: CalendarPeriod,
  minPeriod: CalendarPeriod = MIN_CALENDAR_PERIOD,
): boolean => isBefore(periodStartDate(period), periodStartDate(minPeriod));

/**
 * Najpóźniejszy miesiąc dostępny w kalendarzu: grudzień roku bieżący + 5
 * (np. we wrześniu 2026 → grudzień 2031). Liczony od dzisiejszej daty przy
 * każdym wywołaniu, więc po Nowym Roku limit przesuwa się sam.
 */
export const getMaxCalendarPeriod = (today: Date = new Date()): CalendarPeriod =>
  toCalendarPeriod(endOfYear(addYears(today, APP_MAX_YEARS_AHEAD)));

export const isAfterMaxPeriod = (period: CalendarPeriod): boolean =>
  isAfter(periodStartDate(period), periodStartDate(getMaxCalendarPeriod()));

/** Zwraca okres mieszczący się w zakresie `minPeriod` – `getMaxCalendarPeriod()`. */
export const clampPeriod = (
  period: CalendarPeriod,
  minPeriod: CalendarPeriod = MIN_CALENDAR_PERIOD,
): CalendarPeriod => {
  if (isBeforeMinPeriod(period, minPeriod)) return minPeriod;
  if (isAfterMaxPeriod(period)) return getMaxCalendarPeriod();
  return period;
};

/** Przesuwa okres o `delta` miesięcy — date-fns obsługuje przejście przez granicę roku. */
export const shiftPeriod = (
  period: CalendarPeriod,
  delta: number,
  minPeriod: CalendarPeriod = MIN_CALENDAR_PERIOD,
): CalendarPeriod =>
  clampPeriod(
    toCalendarPeriod(addMonths(periodStartDate(period), delta)),
    minPeriod,
  );
