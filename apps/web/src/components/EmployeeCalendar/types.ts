export type AttendanceStatus =
  | "PRESENT"
  | "OB"
  | "CH"
  | "NN"
  | "UB"
  | "UW"
  | "UM"
  | "NUN"
  | "NUP"
  | "UO"
  | "OP"
  | "REH"
  | "UR"
  | "UŻ"
  | "UOK"
  | "WZS"
  | "WYC";

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

export const STATUS_PRESENTATION: Record<AttendanceStatus, StatusPresentation> =
  {
    PRESENT: {
      code: "OB",
      label: "Obecność",
      dotClassName: "bg-emerald-500",
      textClassName: "text-emerald-600",
    },
    OB: {
      code: "OB",
      label: "Obecność",
      dotClassName: "bg-emerald-500",
      textClassName: "text-emerald-600",
    },
    UW: {
      code: "UW",
      label: "Urlop wypoczynkowy",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    UŻ: {
      code: "UŻ",
      label: "Urlop na żądanie",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    CH: {
      code: "CH",
      label: "Zwolnienie lekarskie",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    OP: {
      code: "OP",
      label: "Opieka",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    NN: {
      code: "NN",
      label: "Nieobecność nieusprawiedliwiona",
      dotClassName: "bg-destructive",
      textClassName: "text-destructive font-semibold",
    },
    UB: {
      code: "UB",
      label: "Urlop bezpłatny",
      dotClassName: "bg-muted-foreground",
      textClassName: "text-muted-foreground",
    },
    UM: {
      code: "UM",
      label: "Urlop macierzyński",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    NUN: {
      code: "NUN",
      label: "Nieobecność usprawiedliwiona niepłatna",
      dotClassName: "bg-muted-foreground",
      textClassName: "text-muted-foreground",
    },
    NUP: {
      code: "NUP",
      label: "Nieobecność usprawiedliwiona płatna",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    UO: {
      code: "UO",
      label: "Urlop ojcowski",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    REH: {
      code: "REH",
      label: "Świadczenie rehabilitacyjne",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    UR: {
      code: "UR",
      label: "Urlop rodzicielski",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    UOK: {
      code: "UOK",
      label: "Urlop okolicznościowy",
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
    },
    WZS: {
      code: "WZS",
      label: "Dzień wolny za święto",
      dotClassName: "bg-blue-500",
      textClassName: "text-blue-600",
    },
    WYC: {
      code: "WYC",
      label: "Urlop wychowawczy",
      dotClassName: "bg-muted-foreground",
      textClassName: "text-muted-foreground",
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
