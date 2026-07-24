import type { AttendanceCode, MonthCalendarData } from "@/lib/types/attendance";
import { apiClient } from "@/services/api-client";
import {
  getMockMonthCalendar,
  lockMockMonth,
  removeMockAttendance,
  setMockAttendance,
} from "@/services/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getMonthCalendar(
  employeeId: string,
  year: number,
  month: number,
): Promise<MonthCalendarData> {
  if (USE_MOCK) return getMockMonthCalendar(employeeId, year, month);
  return apiClient<MonthCalendarData>(
    `/employees/${employeeId}/calendar?year=${year}&month=${month}`,
  );
}

export async function updateDayAttendance(
  employeeId: string,
  date: string,
  code: AttendanceCode,
): Promise<void> {
  if (USE_MOCK) {
    setMockAttendance(employeeId, date, code);
    return;
  }
  await apiClient<void>(`/employees/${employeeId}/attendance`, {
    method: "PUT",
    body: { date, code },
  });
}

export async function deleteDayAttendance(
  employeeId: string,
  date: string,
): Promise<void> {
  if (USE_MOCK) {
    removeMockAttendance(employeeId, date);
    return;
  }
  await apiClient<void>(`/employees/${employeeId}/attendance/${date}`, {
    method: "DELETE",
  });
}

export async function lockMonth(
  employeeId: string,
  year: number,
  month: number,
): Promise<void> {
  if (USE_MOCK) {
    lockMockMonth(employeeId, year, month);
    return;
  }
  await apiClient<void>(`/employees/${employeeId}/calendar/lock`, {
    method: "POST",
    body: { year, month },
  });
}
