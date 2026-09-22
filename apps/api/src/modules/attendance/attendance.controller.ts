import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AbsenceEntity } from './entities/absence.entity';
import { DateQueryDto } from './dto/date-query.dto';
import { ChangeAttendanceStatusDto } from './dto/change-attendance-status.dto';

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

  @Put('/')
  async changeAttendanceStatus(
    @Param('employeeId', new ParseUUIDPipe({ version: '4' }))
    employeeId: string,
    @Body() changeAttendanceStatusDto: ChangeAttendanceStatusDto,
  ): Promise<void> {
    return this.attendanceService.changeAttendanceStatus(
      employeeId,
      changeAttendanceStatusDto,
    );
  }
}
