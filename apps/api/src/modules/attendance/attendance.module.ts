import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { EmployeesModule } from '../employees/employees.module';
import { IsNotDuvetDayConstraint } from 'src/common/validators/is-not-duvet-day.validator';
import { HolidaysModule } from '../holidays/holidays.module';

@Module({
  imports: [
    forwardRef(() => EmployeesModule),
    forwardRef(() => HolidaysModule),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, IsNotDuvetDayConstraint],
})
export class AttendanceModule {}
