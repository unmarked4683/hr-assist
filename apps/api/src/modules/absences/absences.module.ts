import { Module, forwardRef } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [forwardRef(() => EmployeesModule)],
  controllers: [AbsencesController],
  providers: [AbsencesService],
})
export class AbsencesModule {}
