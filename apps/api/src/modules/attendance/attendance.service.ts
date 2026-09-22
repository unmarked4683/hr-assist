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
import { ChangeAttendanceStatusDto } from './dto/change-attendance-status.dto';
import { AbsenceType, AttendanceStatus } from './attendance.types';

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

  async changeAttendanceStatus(
    employeeId: string,
    { date, status }: ChangeAttendanceStatusDto,
  ) {
    await this.employeesService.findOne(employeeId);

    if (status === AttendanceStatus.PRESENCE) {
      console.log('DELETING ABSENCE FOR DATE: ', date);
      await AbsenceEntity.delete({ employee: { id: employeeId }, date });
      return;
    }

    // const absence: AbsenceEntity = (await AbsenceEntity.findOneBy({
    //   employee: { id: employeeId },
    //   date,
    // })) as AbsenceEntity;

    // if (absence) {
    //   if (absence.type !== (status as unknown as AbsenceType)) {
    //     absence.type = status as unknown as AbsenceType;
    //     await absence.save();
    //   }
    //   return;
    // } else {
    //   const newAbsence: AbsenceEntity = AbsenceEntity.create({
    //     employee: { id: employeeId },
    //     date,
    //     type: status as unknown as AbsenceType,
    //   });
    //   await newAbsence.save();
    //   return;
    // }
    const newAbsence = await AbsenceEntity.upsert(
      {
        employee: { id: employeeId },
        date,
        type: status as unknown as AbsenceType,
      },
      ['employee', 'date'],
    );
    console.log('NEW ABSENCE: ', newAbsence);
  }
}
