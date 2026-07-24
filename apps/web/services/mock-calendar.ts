import { POLISH_WEEKDAYS } from "@/lib/constants/calendar";
import type { AttendanceCode, CalendarDay } from "@/lib/types/attendance";
import type { Employee } from "@/lib/types/employee";
import { getDayEditability } from "@/lib/utils/calendar-editability";
import { toIsoDate } from "@/lib/utils/date";
import {
  computeWorkHoursDuration,
  formatDurationHours,
} from "@/lib/utils/working-hours";

const PUBLIC_HOLIDAYS = new Set(["2026-01-01", "2026-05-01", "2026-12-25"]);
const COMPANY_LEAVE_DAYS = new Set(["2026-12-24"]);

function mapAttendanceToDisplay(code: AttendanceCode): CalendarDay["displayStatus"] {
  if (code === "OB") return "OB";
  if (code === "NN") return "NN";
  return "USP";
}

export function buildCalendarDay(
  employee: Employee,
  year: number,
  month: number,
  day: number,
  isLocked: boolean,
  attendanceOverrides: Map<string, AttendanceCode>,
): CalendarDay {
  const dateObj = new Date(year, month - 1, day);
  const date = toIsoDate(dateObj);
  const weekday = dateObj.getDay();
  const isWeekend = weekday === 0 || weekday === 6;
  const isPublicHoliday = PUBLIC_HOLIDAYS.has(date);
  const isCompanyWideLeave = COMPANY_LEAVE_DAYS.has(date);
  const override = attendanceOverrides.get(`${employee.id}:${date}`);
  const attendanceCode: AttendanceCode = isCompanyWideLeave
    ? "UW"
    : override ?? (isWeekend || isPublicHoliday ? "OB" : "OB");

  const workHours = `${employee.workStart} - ${employee.workEnd}`;
  const nominalHours = computeWorkHoursDuration(employee.workStart, employee.workEnd);
  const isWorkingDay = !isWeekend && !isPublicHoliday && !isCompanyWideLeave;
  const realHours =
    isWorkingDay && attendanceCode === "OB"
      ? nominalHours
      : isWorkingDay && attendanceCode === "NN"
        ? 0
        : 0;

  const dayData: CalendarDay = {
    date,
    dayOfMonth: day,
    weekdayLabel: POLISH_WEEKDAYS[weekday] ?? "",
    workHours,
    nominalTime: formatDurationHours(nominalHours),
    realTime: formatDurationHours(realHours),
    displayStatus: mapAttendanceToDisplay(attendanceCode),
    attendanceCode,
    isWeekend,
    isPublicHoliday,
    isCompanyWideLeave,
    isEditable: false,
  };

  dayData.isEditable = getDayEditability(dayData, isLocked).editable;
  return dayData;
}

export function getPublicHolidays(): Set<string> {
  return PUBLIC_HOLIDAYS;
}

export function getCompanyLeaveDays(): Set<string> {
  return COMPANY_LEAVE_DAYS;
}
