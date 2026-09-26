import { addMonths, getMonth, getYear, isBefore, startOfMonth } from "date-fns";
import { APP_START_DATE } from "@/lib/constants";

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

/** Zwraca okres nie wcześniejszy niż `MIN_CALENDAR_PERIOD`. */
export const clampPeriod = (period: CalendarPeriod): CalendarPeriod =>
  isBeforeMinPeriod(period) ? MIN_CALENDAR_PERIOD : period;

/** Przesuwa okres o `delta` miesięcy — date-fns obsługuje przejście przez granicę roku. */
export const shiftPeriod = (
  period: CalendarPeriod,
  delta: number,
): CalendarPeriod =>
  clampPeriod(toCalendarPeriod(addMonths(periodStartDate(period), delta)));
