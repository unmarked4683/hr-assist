export type AttendanceStatus =
  | "PRESENT"
  | "VACATION"
  | "REQUEST_VACATION"
  | "SICK_LEAVE"
  | "CARE_LEAVE"
  | "UNEXCUSED_ABSENCE";

export interface CalendarRecord {
  date: string;
  status: AttendanceStatus;
}

export interface StatusPresentation {
  code: string;
  label: string;
  dotClassName: string;
  textClassName: string;
}

export const STATUS_PRESENTATION: Record<AttendanceStatus, StatusPresentation> = {
  PRESENT: {
    code: "OB",
    label: "Obecność",
    dotClassName: "bg-primary",
    textClassName: "text-foreground",
  },
  VACATION: {
    code: "UW",
    label: "Urlop wypoczynkowy",
    dotClassName: "bg-sky-500",
    textClassName: "text-sky-600",
  },
  REQUEST_VACATION: {
    code: "UŻ",
    label: "Urlop na żądanie",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-600",
  },
  SICK_LEAVE: {
    code: "CH",
    label: "Zwolnienie lekarskie",
    dotClassName: "bg-rose-500",
    textClassName: "text-rose-600",
  },
  CARE_LEAVE: {
    code: "OP",
    label: "Opieka",
    dotClassName: "bg-violet-500",
    textClassName: "text-violet-600",
  },
  UNEXCUSED_ABSENCE: {
    code: "NN",
    label: "Nieobecność nieusprawiedliwiona",
    dotClassName: "bg-destructive",
    textClassName: "text-destructive",
  },
};

export const MONTH_NAMES = [
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

export interface CalendarRow {
  date: Date;
  dateKey: string;
  dayNumber: number;
  weekdayLabel: string;
  isWeekend: boolean;
  isToday: boolean;
  status: AttendanceStatus | null;
  scheduleLabel: string;
  nominalHoursLabel: string;
  actualHoursLabel: string;
}

export const DEFAULT_SCHEDULE = { start: "08:00", end: "16:00" } as const;

export const NOMINAL_WORK_HOURS = 8;
