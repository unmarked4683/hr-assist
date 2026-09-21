import { Module, forwardRef } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { EmployeesModule } from '../employees/employees.module';
import { HolidaysModule } from '../holidays/holidays.module';
import { AbsencesController } from './absences.controller';
import { IsNotDuvetDayConstraint } from 'src/common/validators/is-not-duvet-day.validator';

@Module({
  imports: [
    forwardRef(() => EmployeesModule),
    forwardRef(() => HolidaysModule),
  ],
  controllers: [AbsencesController],
  providers: [AbsencesService, IsNotDuvetDayConstraint],
  exports: [AbsencesService],
})
export class AbsencesModule {}
