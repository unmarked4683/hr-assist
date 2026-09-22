import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AbsenceEntity } from './entities/absence.entity';
import { DateQueryDto } from './dto/date-query.dto';

@Controller('employees/:employeeId/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('/absences')
  async findAbsences(
    @Param('employeeId', new ParseUUIDPipe({ version: '4' }))
    employeeId: string,
    @Query() dateQueryDto: DateQueryDto,
  ): Promise<AbsenceEntity[]> {
    return this.attendanceService.findAbsences(employeeId, dateQueryDto);
  }
}
