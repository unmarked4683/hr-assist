import {
  Controller,
  Get,
  Param,
  // ParseIntPipe,
  ParseUUIDPipe,
  Query,
  // Query,
} from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { DateQueryDto } from './dto/date-query.dto';
import { AbsenceEntity } from './entities/absence.entity';

@Controller('absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Get('/:employeeId')
  findAbsences(
    @Param('employeeId', new ParseUUIDPipe({ version: '4' }))
    employeeId: string,
    @Query() dateQuery: DateQueryDto,
  ): Promise<AbsenceEntity[]> {
    return this.absencesService.findAbsences(employeeId, dateQuery);
  }

  // TODO add absences logic
}
