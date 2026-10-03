import { AbsenceType, AttendanceStatus } from '../attendance/attendance.types';

export interface IGetMonthReportParamsDto {
  employeeId: string;
  year: number;
  month: number;
}

export type Day =
  | {
      status: Exclude<AttendanceStatus, AttendanceStatus.HOLIDAY> | AbsenceType;
    }
  | { status: AttendanceStatus.HOLIDAY; name?: string };
