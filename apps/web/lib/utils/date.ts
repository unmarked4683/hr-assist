import { POLISH_MONTHS } from "@/lib/constants/calendar";

export function formatBirthDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function getMonthLabel(month: number): string {
  return POLISH_MONTHS[month - 1] ?? "";
}

export function formatCalendarHeader(date: Date): string {
  const day = date.getDate();
  const month = getMonthLabel(date.getMonth() + 1).toUpperCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
