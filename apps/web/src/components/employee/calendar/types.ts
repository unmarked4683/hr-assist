import { z } from "zod";

/**
 * Kody statusów frekwencji — wartości enuma odzwierciedlają 1:1 kody
 * zwracane i przyjmowane przez backend (np. "OB", "UŻ").
 */
export enum AttendanceStatus {
  OB = "OB",
  CH = "CH",
  NN = "NN",
  UB = "UB",
  UW = "UW",
  UM = "UM",
  NUN = "NUN",
  NUP = "NUP",
  UO = "UO",
  OP = "OP",
  REH = "REH",
  UR = "UR",
  UŻ = "UŻ",
  UOK = "UOK",
  WZS = "WZS",
  WYC = "WYC",
}

export interface CalendarRecord {
  date: string;
  status: AttendanceStatus;
}

export interface StatusPresentation {
  code: string;
  label: string;
  dotClassName?: string;
  textClassName?: string;
}

/**
 * Jedyne miejsce definiujące etykiety i skróty statusów frekwencji.
 * `Record` (zamiast `Partial`) wymusza w czasie kompilacji zdefiniowanie
 * prezentacji dla KAŻDEJ wartości `AttendanceStatus` — dodanie nowego
 * statusu do enuma bez uzupełnienia mapy nie przejdzie build'u.
 */
export const STATUS_PRESENTATION: Record<AttendanceStatus, StatusPresentation> =
  {
    [AttendanceStatus.OB]: {
      code: "OB",
      label: "Obecność",
      dotClassName: "bg-emerald-500",
      textClassName: "text-emerald-600",
    },
    [AttendanceStatus.NN]: {
      code: "NN",
      label: "Nieobecność nieusprawiedliwiona",
      dotClassName: "bg-destructive",
      textClassName: "text-destructive font-semibold",
    },
    [AttendanceStatus.UW]: { code: "UW", label: "Urlop wypoczynkowy" },
    [AttendanceStatus.UŻ]: { code: "UŻ", label: "Urlop na żądanie" },
    [AttendanceStatus.CH]: { code: "CH", label: "Zwolnienie lekarskie" },
    [AttendanceStatus.OP]: { code: "OP", label: "Opieka" },
    [AttendanceStatus.UB]: { code: "UB", label: "Urlop bezpłatny" },
    [AttendanceStatus.UM]: { code: "UM", label: "Urlop macierzyński" },
    [AttendanceStatus.NUN]: {
      code: "NUN",
      label: "Nieobecność usprawiedliwiona niepłatna",
    },
    [AttendanceStatus.NUP]: {
      code: "NUP",
      label: "Nieobecność usprawiedliwiona płatna",
    },
    [AttendanceStatus.UO]: { code: "UO", label: "Urlop ojcowski" },
    [AttendanceStatus.REH]: {
      code: "REH",
      label: "Świadczenie rehabilitacyjne",
    },
    [AttendanceStatus.UR]: { code: "UR", label: "Urlop rodzicielski" },
    [AttendanceStatus.UOK]: { code: "UOK", label: "Urlop okolicznościowy" },
    [AttendanceStatus.WZS]: { code: "WZS", label: "Dzień wolny za święto" },
    [AttendanceStatus.WYC]: { code: "WYC", label: "Urlop wychowawczy" },
  };

/** Zwraca etykietę statusu — jedyne miejsce, które o niej "wie". */
export function getStatusLabel(status: AttendanceStatus): string {
  return STATUS_PRESENTATION[status].label;
}

/** Zwraca skrót statusu — jedyne miejsce, które o nim "wie". */
export function getStatusCode(status: AttendanceStatus): string {
  return STATUS_PRESENTATION[status].code;
}

/** Statusy traktowane jako urlop — po ich zapisaniu odświeżamy dane o urlopach. */
export const LEAVE_ATTENDANCE_STATUSES: readonly AttendanceStatus[] = [
  AttendanceStatus.UŻ,
  AttendanceStatus.UW,
];

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

export interface UpdateEmployeeAttendanceDto {
  status: AttendanceStatus;
  date: string;
}

export const updateEmployeeAttendanceSchema = z.object({
  status: z.nativeEnum(AttendanceStatus),
  date: z.string().datetime(),
});

export type UpdateEmployeeAttendanceInput = z.infer<
  typeof updateEmployeeAttendanceSchema
>;
