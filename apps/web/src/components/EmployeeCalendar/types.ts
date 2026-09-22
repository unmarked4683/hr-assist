import { z } from "zod";

export type AttendanceStatus =
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
  dotClassName?: string;
  textClassName?: string;
}

export const STATUS_PRESENTATION: Partial<
  Record<AttendanceStatus, StatusPresentation>
> = {
  OB: {
    code: "OB",
    label: "Obecność",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-600",
  },
  NN: {
    code: "NN",
    label: "Nieobecność nieusprawiedliwiona",
    dotClassName: "bg-destructive",
    textClassName: "text-destructive font-semibold",
  },
  UW: { code: "UW", label: "Urlop wypoczynkowy" },
  UŻ: { code: "UŻ", label: "Urlop na żądanie" },
  CH: { code: "CH", label: "Zwolnienie lekarskie" },
  OP: { code: "OP", label: "Opieka" },
  UB: { code: "UB", label: "Urlop bezpłatny" },
  UM: { code: "UM", label: "Urlop macierzyński" },
  NUN: { code: "NUN", label: "Nieobecność usprawiedliwiona niepłatna" },
  NUP: { code: "NUP", label: "Nieobecność usprawiedliwiona płatna" },
  UO: { code: "UO", label: "Urlop ojcowski" },
  REH: { code: "REH", label: "Świadczenie rehabilitacyjne" },
  UR: { code: "UR", label: "Urlop rodzicielski" },
  UOK: { code: "UOK", label: "Urlop okolicznościowy" },
  WZS: { code: "WZS", label: "Dzień wolny za święto" },
  WYC: { code: "WYC", label: "Urlop wychowawczy" },
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

export interface UpdateEmployeeAttendanceDto {
  status: AttendanceStatus;
  date: string;
}

export const updateEmployeeAttendanceSchema = z.object({
  status: z.enum([
    "OB",
    "CH",
    "NN",
    "UB",
    "UW",
    "UM",
    "NUN",
    "NUP",
    "UO",
    "OP",
    "REH",
    "UR",
    "UŻ",
    "UOK",
    "WZS",
    "WYC",
  ] as [AttendanceStatus, ...AttendanceStatus[]]),
  date: z.string().datetime(),
});

export type UpdateEmployeeAttendanceInput = z.infer<
  typeof updateEmployeeAttendanceSchema
>;
