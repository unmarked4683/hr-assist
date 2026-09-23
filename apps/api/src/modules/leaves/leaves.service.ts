import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { LeaveDetailsDto, LeaveDto } from './dto/leave.dto';
import { AbsenceEntity } from '../attendance/entities/absence.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AbsenceType } from '../attendance/attendance.types';
import { getYear } from 'date-fns';

@Injectable()
export class LeavesService {
  constructor(
    @Inject(forwardRef(() => EmployeesService))
    private readonly employeesService: EmployeesService,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findLeaveForCurrentYear(employeeId: string): Promise<LeaveDto> {
    const currentYear: number = getYear(new Date());
    const employee = await this.employeesService.findOneById(employeeId);

    const overdueBaseValue = employee.leave?.overdue ?? 0;
    const currentBaseValue = employee.leave?.current ?? 26;

    const leavesCount: number = await this.findLeavesCountByYear(
      employeeId,
      currentYear,
    );

    const overdue: LeaveDetailsDto = {
      base: overdueBaseValue,
      used: 0,
    };

    const current: LeaveDetailsDto = {
      base: currentBaseValue,
      used: 0,
    };

    if (leavesCount <= overdue.base) {
      overdue.used = leavesCount;
      current.used = 0;
    } else {
      overdue.used = overdue.base;
      current.used = leavesCount - overdue.base;
    }

    const leaveDto: LeaveDto = {
      overdue,
      current,
    };

    console.log('LEAVE DTO: ', leaveDto);

    return leaveDto;
  }

  async findLeavesCountByYear(
    employeeId: string,
    year: number,
  ): Promise<number> {
    await this.employeesService.findOneById(employeeId);

    const { leavesCount } = (await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)::int', 'leavesCount')
      .from(AbsenceEntity, 'a')
      .where('a.employeeId = :employeeId', { employeeId })
      .andWhere('EXTRACT(YEAR FROM a.date) = :year', { year })
      .andWhere('a.type IN (:...types)', {
        types: [AbsenceType.VACATION_LEAVE, AbsenceType.ON_DEMAND_LEAVE],
      })
      .getRawOne<{ leavesCount: number }>())!;

    return leavesCount;
  }
}
