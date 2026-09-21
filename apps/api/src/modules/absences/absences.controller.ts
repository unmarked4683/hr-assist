import { Body, Controller, Post } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { EmployeesService } from '../employees/employees.service';
import { AddAbsenceDto } from './dto/add-absence.dto';
import { AbsenceEntity } from './entities/absence.entity';

@Controller('absences')
export class AbsencesController {
  constructor(
    private readonly absencesService: AbsencesService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post('/')
  addAbsence(@Body() addAbsenceDto: AddAbsenceDto): Promise<AbsenceEntity> {
    return this.absencesService.addAbsence(addAbsenceDto);
  }

  // TODO add absences logic
}
