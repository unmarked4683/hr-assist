import { Module, forwardRef } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesService } from '../companies/companies.service';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    forwardRef(() => CompaniesModule),
    forwardRef(() => AttendanceModule),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, CompaniesService],
  exports: [forwardRef(() => EmployeesService)],
})
export class EmployeesModule {}
