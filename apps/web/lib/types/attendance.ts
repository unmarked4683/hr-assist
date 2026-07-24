export type AttendanceCode =
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

export type CalendarDisplayStatus = "OB" | "NN" | "USP";

export type MonthLockState =
  | "current_month"
  | "manual_window"
  | "system_locked"
  | "unlocked";

export interface DayAttendance {
  date: string;
  code: AttendanceCode;
  isCompanyWideLeave?: boolean;
}

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  weekdayLabel: string;
  workHours: string;
  nominalTime: string;
  realTime: string;
  displayStatus: CalendarDisplayStatus;
  attendanceCode: AttendanceCode;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  isCompanyWideLeave: boolean;
  isEditable: boolean;
}

export interface MonthCalendarData {
  employeeId: string;
  year: number;
  month: number;
  lockState: MonthLockState;
  isLocked: boolean;
  days: CalendarDay[];
}
