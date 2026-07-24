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

export const CALENDAR_COLUMN_HEADERS = [
  "Dzień",
  "Dzień tygodnia",
  "Godziny pracy",
  "Nominalny czas",
  "Realny czas",
  "Status",
] as const;

export const LOCK_TOOLTIPS = {
  currentMonth:
    "Nie można zablokować miesiąca, gdyż jeszcze trwa",
  manualWindow: "Kliknij, aby trwale zablokować edycję miesiąca",
  systemLocked: "Miesiąc zablokowany automatycznie",
  unlocked: "Miesiąc odblokowany",
} as const;

export const CONFIRM_LOCK_MESSAGE = "Czy na pewno chcesz zablokować ten miesiąc?";
