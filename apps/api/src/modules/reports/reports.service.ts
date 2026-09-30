import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GetMonthReportParamsDto } from './dto/get-month-report.dto';
import { getDate, getDaysInMonth, isWeekend } from 'date-fns';
import { AbsenceEntity } from '../attendance/entities/absence.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { AttendanceStatus } from '../attendance/attendance.types';
import { Day } from './reports.types';
import { HolidayEntity } from '../holidays/entities/holiday.entity';
import { HolidaysService } from '../holidays/holidays.service';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { EmployeesService } from '../employees/employees.service';
import { ReportEngine } from './report.engine';
import { CompanyEntity } from '../companies/entities/company.entity';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,

    @Inject(forwardRef(() => HolidaysService))
    private readonly holidaysService: HolidaysService,

    @Inject(forwardRef(() => EmployeesService))
    private readonly employeesService: EmployeesService,

    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,

    private readonly reportEngine: ReportEngine,
  ) {}

  async getMonthReportForSingleEmployee({
    employeeId,
    month,
    year,
  }: GetMonthReportParamsDto) {
    const daysInMonth: Map<number, Day> = await this.buildMonthDaysMap(
      employeeId,
      year,
      month,
    );

    const employee: EmployeeEntity =
      await this.employeesService.findOneById(employeeId);

    const company: CompanyEntity = await this.companiesService.findOne(
      employee.company.id,
    );

    await this.reportEngine.generateEmployeeReportFile({
      employee,
      company,
      year,
      month,
      daysInMonth,
    });
  }

  private async buildMonthDaysMap(
    employeeId: string,
    year: number,
    month: number,
  ): Promise<Map<number, Day>> {
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
      daysInMonth.set(getDate(new Date(date)), { status: type });
    }

    const holidays: HolidayEntity[] =
      await this.holidaysService.findHolidaysForMonth({ year, month });

    if (holidays.length > 0) {
      for (const { name, date } of holidays) {
        daysInMonth.set(getDate(new Date(date)), {
          status: AttendanceStatus.HOLIDAY,
          name,
        });
      }
    }

    return daysInMonth;
  }
}
