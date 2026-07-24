import {
  FTE_HOURS_MAP,
  WORK_TIME_MAX,
  WORK_TIME_MIN,
} from "@/lib/constants/employee-form";
import type { FteFraction } from "@/lib/types/employee";

export interface WorkingHoursValidation {
  valid: boolean;
  errors: {
    workStart?: string;
    workEnd?: string;
  };
}

function parseTime(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function computeWorkHoursDuration(workStart: string, workEnd: string): number {
  return (parseTime(workEnd) - parseTime(workStart)) / 60;
}

export function formatDurationHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getDailyHoursFromFte(fte: FteFraction): number {
  return FTE_HOURS_MAP[fte];
}

export function computeEndTime(workStart: string, fte: FteFraction): string {
  const startMinutes = parseTime(workStart);
  const endMinutes = startMinutes + getDailyHoursFromFte(fte) * 60;
  return formatTime(endMinutes);
}

export function validateWorkingHours(
  workStart: string,
  workEnd: string,
): WorkingHoursValidation {
  const errors: WorkingHoursValidation["errors"] = {};
  const start = parseTime(workStart);
  const end = parseTime(workEnd);
  const min = parseTime(WORK_TIME_MIN);
  const max = parseTime(WORK_TIME_MAX);

  if (start < min || start > max) {
    errors.workStart = `Dozwolony zakres: ${WORK_TIME_MIN}–${WORK_TIME_MAX}`;
  }

  if (end < min || end > max) {
    errors.workEnd = `Dozwolony zakres: ${WORK_TIME_MIN}–${WORK_TIME_MAX}`;
  }

  if (end <= start) {
    errors.workEnd = "Godzina zakończenia musi być późniejsza";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatFteLabel(fte: FteFraction): string {
  const hours = getDailyHoursFromFte(fte);
  const fullTimeLabel = fte === "8/8" ? "Pełen etat" : "Część etatu";
  return `${hours} godz./dzień (${fullTimeLabel})`;
}
