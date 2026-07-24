import type { AttendanceCode } from "@/lib/types/attendance";

export interface AttendanceDefinition {
  code: AttendanceCode;
  label: string;
  colorToken: "ok" | "nn" | "usp" | "neutral";
}

export const ATTENDANCE_DICTIONARY: AttendanceDefinition[] = [
  { code: "OB", label: "Obecność", colorToken: "ok" },
  { code: "CH", label: "Chorobowe", colorToken: "neutral" },
  { code: "NN", label: "Nieobecność nieusprawiedliwiona", colorToken: "nn" },
  { code: "UB", label: "Urlop bezpłatny", colorToken: "usp" },
  { code: "UW", label: "Urlop wypoczynkowy", colorToken: "usp" },
  { code: "UM", label: "Urlop macierzyński", colorToken: "usp" },
  { code: "NUN", label: "Nieobecność usprawiedliwiona niepłatna", colorToken: "usp" },
  { code: "NUP", label: "Nieobecność usprawiedliwiona płatna", colorToken: "usp" },
  { code: "UO", label: "Urlop ojcowski", colorToken: "usp" },
  { code: "OP", label: "Opieka", colorToken: "usp" },
  { code: "REH", label: "Świadczenie rehabilitacyjne", colorToken: "usp" },
  { code: "UR", label: "Urlop rodzicielski", colorToken: "usp" },
  { code: "UŻ", label: "Urlop na żądanie", colorToken: "usp" },
  { code: "UOK", label: "Urlop okolicznościowy", colorToken: "usp" },
  { code: "WZS", label: "Dzień wolny za święto", colorToken: "usp" },
  { code: "WYC", label: "Urlop wychowawczy", colorToken: "usp" },
];

export const ATTENDANCE_OPTIONS = ATTENDANCE_DICTIONARY.map((item) => ({
  value: item.code,
  label: `${item.label} (${item.code})`,
}));

export function getAttendanceLabel(code: AttendanceCode): string {
  const match = ATTENDANCE_DICTIONARY.find((item) => item.code === code);
  return match?.label ?? code;
}

export function getAttendanceDefinition(
  code: AttendanceCode,
): AttendanceDefinition | undefined {
  return ATTENDANCE_DICTIONARY.find((item) => item.code === code);
}
