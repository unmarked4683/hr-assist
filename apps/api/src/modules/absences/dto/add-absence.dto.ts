import { IsEnum, IsNotEmpty, IsDate, MinDate, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AbsenceType, IAddAbsenceDto } from '../absences.types';
import { parseISO, addYears, endOfYear } from 'date-fns';
import { IsNotDuvetDay } from 'src/common/validators/is-not-duvet-day.validator';

const MIN_ABSENCE_DATE: Date = parseISO('2026-01-01');

const MAX_ABSENCE_DATE: Date = endOfYear(addYears(new Date(), 5));

export class AddAbsenceDto implements IAddAbsenceDto {
  @IsEnum(AbsenceType)
  @IsNotEmpty()
  type: AbsenceType;

  @Type(() => Date)
  @IsDate()
  @MinDate(MIN_ABSENCE_DATE, {
    message: 'Data nie może być wcześniejsza niż 1 stycznia 2026',
  })
  @MaxDate(MAX_ABSENCE_DATE, {
    message: 'Data nie może wybiegać więcej niż 5 lat w przyszłość',
  })
  @IsNotEmpty()
  @IsNotDuvetDay()
  date: Date;
}
