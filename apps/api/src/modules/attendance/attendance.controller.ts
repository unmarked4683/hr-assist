import { Controller } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { EmployeesService } from '../employees/employees.service';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly employeesService: EmployeesService,
  ) {}

  // TODO
}
