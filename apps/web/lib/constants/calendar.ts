export const POLISH_MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export const POLISH_WEEKDAYS = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
] as const;

export const CALENDAR_YEAR_MIN = 2026;
export const CALENDAR_YEAR_MAX = 2036;

/** Szerokości kolumn: wagi 2:4:4:3:3:2 (największy udział — dzień tygodnia i godziny pracy). */
export const CALENDAR_COLUMNS = [
  {
    id: "dayOfMonth",
    header: "Dzień miesiąca",
    width: "11.111%",
    cellClassName: "tabular-nums",
  },
  {
    id: "weekday",
    header: "Dzień tygodnia",
    width: "22.222%",
  },
  {
    id: "workHours",
    header: "Godziny pracy",
    width: "22.222%",
    cellClassName: "whitespace-nowrap",
  },
  {
    id: "nominalTime",
    header: "Nominalny czas",
    width: "16.667%",
    cellClassName: "whitespace-nowrap tabular-nums",
  },
  {
    id: "realTime",
    header: "Realny czas",
    width: "16.667%",
    cellClassName: "whitespace-nowrap tabular-nums",
  },
  {
    id: "status",
    header: "Status",
    width: "11.111%",
  },
] as const;

export type CalendarColumnId = (typeof CALENDAR_COLUMNS)[number]["id"];

export const LOCK_TOOLTIPS = {
  currentMonth:
    "Nie można zablokować miesiąca, gdyż jeszcze trwa",
  manualWindow: "Kliknij, aby trwale zablokować edycję miesiąca",
  systemLocked: "Miesiąc zablokowany automatycznie",
  unlocked: "Miesiąc odblokowany",
} as const;

export const CONFIRM_LOCK_MESSAGE = "Czy na pewno chcesz zablokować ten miesiąc?";
