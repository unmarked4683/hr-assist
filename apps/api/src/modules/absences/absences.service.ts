import { Injectable } from '@nestjs/common';
import { AbsenceEntity } from './entities/absence.entity';
import { EmployeesService } from '../employees/employees.service';
import { DateQueryDto } from './dto/date-query.dto';
import { Between, FindOptionsWhere } from 'typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AbsencesService {
  constructor(private readonly employeesService: EmployeesService) {}

  async findAbsences(
    employeeId: string,
    { year, month }: DateQueryDto = {},
  ): Promise<AbsenceEntity[]> {
    const employee = await this.employeesService.findOne(employeeId);

    const where: FindOptionsWhere<AbsenceEntity> = {
      employee: { id: employee.id },
    };

    if (year) {
      const startM = (month ?? 1) - 1;
      const endM = (month ?? 12) - 1;

      const startDate = startOfMonth(new Date(Date.UTC(year, startM, 1)));
      const endDate = endOfMonth(new Date(Date.UTC(year, endM, 1)));

      where.date = Between(startDate, endDate);
    }

    return AbsenceEntity.find({ where });
  }
}
