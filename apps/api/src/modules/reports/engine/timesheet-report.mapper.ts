import { getDaysInMonth } from 'date-fns';
import { AttendanceStatus } from '../../attendance/attendance.types';
import { Day } from './reports.types';
import {
  Company,
  DailyTimesheetRow,
  Employee,
  MonthlyTimesheetData,
  OvertimeHours,
} from './timesheet-report.types';

const WORK_START_HOUR: number = 8;

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

interface TimesheetSource {
  employee: Employee;
  company: Company;
  year: number;
  month: number;
  daysInMonth: Map<number, Day>;
}

/**
 * Resolves the per-day attendance statuses of one month into timesheet rows
 * with hours, ready to be rendered by the ReportEngine.
 */
export const toMonthlyTimesheetData = ({
  employee,
  company,
  year,
  month,
  daysInMonth,
}: TimesheetSource): MonthlyTimesheetData => {
  const totalDays: number = getDaysInMonth(new Date(year, month - 1));
  const rows: DailyTimesheetRow[] = [];

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const day: Day | undefined = daysInMonth.get(dayNum);

    if (!day) {
      throw new Error(`Missing attendance data for day ${dayNum}`);
    }

    rows.push(
      toDailyRow(new Date(year, month - 1, dayNum), day, employee.workHours),
    );
  }

  return { year, month, employee, company, rows };
};

const toDailyRow = (
  date: Date,
  day: Day,
  workHours: number,
): DailyTimesheetRow => {
  const weekdayLabel: string = WEEKDAY_LABELS[date.getDay()];

  if (day.status === AttendanceStatus.HOLIDAY) {
    return {
      date,
      dayLabel: day.name || weekdayLabel,
      isDayOff: true,
      workHoursRange: null,
      nominalHours: 0,
      actualHours: 0,
      overtime: { ...NO_OVERTIME },
      absence: null,
    };
  }

  const workday = {
    date,
    dayLabel: weekdayLabel,
    isDayOff: false,
    workHoursRange: getWorkHoursRangeLabel(workHours),
    nominalHours: workHours,
    overtime: { ...NO_OVERTIME },
  };

  if (day.status === AttendanceStatus.PRESENCE) {
    return { ...workday, actualHours: workHours, absence: null };
  }

  return {
    ...workday,
    actualHours: 0,
    absence: { status: day.status, hours: workHours },
  };
};

const getWorkHoursRangeLabel = (workHours: number): string =>
  `${WORK_START_HOUR}:00-${WORK_START_HOUR + workHours}:00`;
