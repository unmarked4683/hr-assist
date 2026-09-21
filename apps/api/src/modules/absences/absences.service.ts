import { Injectable } from '@nestjs/common';
import { AddAbsenceDto } from './dto/add-absence.dto';
import { AbsenceEntity } from './entities/absence.entity';

@Injectable()
export class AbsencesService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addAbsence(addAbsenceDto: AddAbsenceDto): Promise<AbsenceEntity> {
    return new Promise((resolve) => {
      resolve(new AbsenceEntity());
    });
  }
}
