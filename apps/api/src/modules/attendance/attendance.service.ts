import { Injectable } from '@nestjs/common';
import { DateQueryDto } from './dto/date-query.dto';
import { AbsenceEntity } from './entities/absence.entity';
import { EmployeesService } from '../employees/employees.service';
import { FindOptionsWhere, Between } from 'typeorm';
import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  set,
} from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(private readonly employeesService: EmployeesService) {}

  async findAbsences(
    employeeId: string,
    { year, month }: DateQueryDto,
  ): Promise<AbsenceEntity[]> {
    await this.employeesService.findOne(employeeId);

    const where: FindOptionsWhere<AbsenceEntity> = {
      employee: { id: employeeId },
    };

    if (year) {
      if (month) {
        const targetDate: Date = set(new Date(), { year, month, date: 0 });

        where.date = Between(startOfMonth(targetDate), endOfMonth(targetDate));
      } else {
        const targetDate: Date = set(new Date(), { year });

        where.date = Between(startOfYear(targetDate), endOfYear(targetDate));
      }
    }

    return AbsenceEntity.find({ where });
  }
}
