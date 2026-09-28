import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GetMonthReportParamsDto } from './dto/get-month-report.dto';
import { getDate, getDay, getDaysInMonth, isWeekend } from 'date-fns';
import { AbsenceEntity } from '../attendance/entities/absence.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { AttendanceStatus } from '../attendance/attendance.types';
import { Day } from './reports.types';
import { HolidayEntity } from '../holidays/entities/holiday.entity';
import { HolidaysService } from '../holidays/holidays.service';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,

    @Inject(forwardRef(() => HolidaysService))
    private readonly holidaysService: HolidaysService,
  ) {}
  async getMonthReportForSingleEmployee({
    employeeId,
    month,
    year,
  }: GetMonthReportParamsDto) {
    const daysCount: number = getDaysInMonth(new Date(year, month - 1));
    const daysInMonth: Map<number, Day> = new Map();

    for (let i = 1; i <= daysCount; i++) {
      const currentDate = new Date(year, month - 1, i);

      if (isWeekend(currentDate)) {
        const dayName = currentDate.getDay() === 0 ? 'Niedziela' : 'Sobota';
        daysInMonth.set(i, { status: AttendanceStatus.HOLIDAY, name: dayName });
      } else {
        daysInMonth.set(i, { status: AttendanceStatus.PRESENCE });
      }
    }

    const absences: AbsenceEntity[] = await this.attendanceService.findAbsences(
      employeeId,
      { year, month },
    );

    for (const { date, type } of absences) {
      daysInMonth.set(getDay(date), { status: type });
    }

    const holidays: HolidayEntity[] =
      await this.holidaysService.findHolidaysForMonth({
        year,
        month,
      });

    if (holidays.length > 0) {
      for (const { name, date } of holidays) {
        daysInMonth.set(getDate(date), {
          status: AttendanceStatus.HOLIDAY,
          name,
        });
      }
    }
    console.log('DAYS IN MONTH WITH HOLIDAYS AND ABSENCES', daysInMonth);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 100);
    });
  }
}
