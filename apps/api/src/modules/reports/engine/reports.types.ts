import {
  AbsenceType,
  AttendanceStatus,
} from '../../attendance/attendance.types';

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

export interface GeneratedReportFile {
  /** Absolute path of the saved file */
  filePath: string;
  /** e.g. '89012345678-andrzej-sliwowski-09-2026.xlsx' */
  fileName: string;
}
