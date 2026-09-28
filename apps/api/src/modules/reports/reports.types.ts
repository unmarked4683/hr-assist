import { AttendanceStatus } from '../attendance/attendance.types';

export interface IGetMonthReportParamsDto {
  employeeId: string;
  year: number;
  month: number;
}

export type Day =
  | { status: Omit<AttendanceStatus, AttendanceStatus.HOLIDAY> }
  | { status: AttendanceStatus.HOLIDAY; name: string };
