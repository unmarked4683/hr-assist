import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [forwardRef(() => EmployeesModule)],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
