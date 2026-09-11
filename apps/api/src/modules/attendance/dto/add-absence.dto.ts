import { IsEnum, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { AbsenceType, IAddAbsenceDto } from '../attendance.types';

export class AddAbsenceDto implements IAddAbsenceDto {
  @IsEnum(AbsenceType)
  @IsNotEmpty()
  type: AbsenceType;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsUUID(4)
  @IsNotEmpty()
  employee: string;
}
