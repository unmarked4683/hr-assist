import { Module, forwardRef } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesService } from '../companies/companies.service';
import { AttendanceModule } from '../attendance/attendance.module';
import { IsCompanyIdConstraint } from 'src/common/validators/is-company-id.validator';

@Module({
  imports: [
    forwardRef(() => CompaniesModule),
    forwardRef(() => AttendanceModule),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, CompaniesService, IsCompanyIdConstraint],
  exports: [forwardRef(() => EmployeesService)],
})
export class EmployeesModule {}
