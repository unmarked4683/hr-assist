import type { CalendarDay } from "@/lib/types/attendance";

export type EditabilityCursor = "pointer" | "not-allowed";

export interface DayEditability {
  editable: boolean;
  cursor: EditabilityCursor;
}

export function getDayEditability(day: CalendarDay, isMonthLocked: boolean): DayEditability {
  const editable =
    !isMonthLocked &&
    !day.isWeekend &&
    !day.isPublicHoliday &&
    !day.isCompanyWideLeave;

  return {
    editable,
    cursor: editable ? "pointer" : "not-allowed",
  };
}
