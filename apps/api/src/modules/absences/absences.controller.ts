import {
  Body,
  Controller,
  Get,
  Param,
  // ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  // Query,
} from '@nestjs/common';
import { AbsencesService } from 'src/modules/absences/absences.service';
import { AddAbsenceDto } from 'src/modules/absences/dto/add-absence.dto';
import { DateQueryDto } from 'src/modules/absences/dto/date-query.dto';
import { AbsenceEntity } from 'src/modules/absences/entities/absence.entity';

@Controller('employees/:employeeId/absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Get('/')
  findAbsences(
    @Param('employeeId', new ParseUUIDPipe({ version: '4' }))
    employeeId: string,
    @Query() dateQuery: DateQueryDto,
  ): Promise<AbsenceEntity[]> {
    return this.absencesService.findAbsences(employeeId, dateQuery);
  }

  @Post('/')
  addAbsence(
    @Body() addAbsenceDto: AddAbsenceDto,
    @Param('employeeId', new ParseUUIDPipe({ version: '4' }))
    employeeId: string,
  ): Promise<AbsenceEntity> {
    return this.absencesService.addAbsence(employeeId, addAbsenceDto);
  }
  // TODO add absences logic
}
