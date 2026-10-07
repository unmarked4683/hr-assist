import { eachDayOfInterval, endOfMonth, format, isWeekend } from 'date-fns';
import { AbsenceType } from '../../attendance/attendance.types';
import {
  AttendanceRecord,
  Company,
  DailyTimesheetRow,
  Employee,
  MonthlyTimesheetData,
  OvertimeHours,
  PublicHoliday,
} from './timesheet-report.types';

const WEEKDAY_LABELS: string[] = [
  'Nd.',
  'Pon.',
  'Wt.',
  'Śr.',
  'Czw.',
  'Pt.',
  'Sob.',
];

// Overtime is not tracked yet, every day reports zero hours
const NO_OVERTIME: OvertimeHours = {
  day: 0,
  night: 0,
  saturdays: 0,
  sundaysAndHolidays: 0,
  nightTime: 0,
};

/** What a calendar day is for the employee — decides every hour in its row. */
type ReportDay =
  | { kind: 'notEmployed' }
  | { kind: 'holiday'; name: string }
  | { kind: 'weekend' }
  /** `absence: null` means the employee was present. */
  | { kind: 'workday'; absence: AbsenceType | null };

export interface TimesheetSource {
  employee: Employee;
  company: Company;
  year: number;
  /** 1-12 */
  month: number;
  absences: AttendanceRecord[];
  holidays: PublicHoliday[];
}

/**
 * Days are compared as 'yyyy-MM-dd' strings, which also sort correctly.
 *
 * Date-only values (absences, holidays, employment date) are stored as UTC
 * midnight, so their day is the UTC date — whatever the server's time zone.
 */
const dateOnlyKey = (value: Date | string): string =>
  new Date(value).toISOString().slice(0, 10);

/** Day of a local date — the report's own days and the `firedAt` moment. */
const localDayKey = (date: Date): string => format(date, 'yyyy-MM-dd');

/**
 * Resolves one month of attendance into timesheet rows with hours, ready to
 * be rendered by the ReportEngine.
 */
export const toMonthlyTimesheetData = ({
  employee,
  company,
  year,
  month,
  absences,
  holidays,
}: TimesheetSource): MonthlyTimesheetData => {
  const absenceByDay = new Map(
    absences.map(({ date, type }) => [dateOnlyKey(date), type]),
  );
  const holidayByDay = new Map(
    holidays.map(({ date, name }) => [dateOnlyKey(date), name]),
  );
  const hiredOn: string = dateOnlyKey(employee.employmentDate);
  const firedOn: string | null = employee.firedAt
    ? localDayKey(employee.firedAt)
    : null;

  // Same order of precedence as the web calendar (describeCalendarDay).
  const resolveDay = (date: Date): ReportDay => {
    const day: string = localDayKey(date);

    if (day < hiredOn || (firedOn !== null && day > firedOn)) {
      return { kind: 'notEmployed' };
    }

    const holidayName: string | undefined = holidayByDay.get(day);
    if (holidayName) return { kind: 'holiday', name: holidayName };

    if (isWeekend(date)) return { kind: 'weekend' };

    return { kind: 'workday', absence: absenceByDay.get(day) ?? null };
  };

  const firstDay = new Date(year, month - 1, 1);
  const rows: DailyTimesheetRow[] = eachDayOfInterval({
    start: firstDay,
    end: endOfMonth(firstDay),
  }).map((date) => toDailyRow(date, resolveDay(date), employee));

  return { year, month, employee, company, rows };
};

const toDailyRow = (
  date: Date,
  day: ReportDay,
  { workHours, workSchedule }: Employee,
): DailyTimesheetRow => {
  const weekdayLabel: string = WEEKDAY_LABELS[date.getDay()];

  if (day.kind !== 'workday') {
    return {
      date,
      dayLabel: day.kind === 'holiday' ? day.name : weekdayLabel,
      isDayOff: true,
      workHoursRange: null,
      nominalHours: 0,
      actualHours: 0,
      overtime: { ...NO_OVERTIME },
      absence: null,
    };
  }

  // Only presence counts as worked time; an absence books the whole working
  // day in its own column instead.
  return {
    date,
    dayLabel: weekdayLabel,
    isDayOff: false,
    // 'HH:mm:ss' from the database -> '07:00-14:00'
    workHoursRange: `${workSchedule.start.slice(0, 5)}-${workSchedule.end.slice(0, 5)}`,
    nominalHours: workHours,
    actualHours: day.absence ? 0 : workHours,
    overtime: { ...NO_OVERTIME },
    absence: day.absence ? { status: day.absence, hours: workHours } : null,
  };
};
