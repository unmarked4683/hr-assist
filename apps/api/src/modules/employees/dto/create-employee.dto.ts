import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ContractType, ICreateEmployeeDto, Location } from '../employee.types';
import { WorkScheduleDto } from './work-schedule.dto';
import { IsPesel } from 'src/common/validators/is-pesel.validator';
import { LeaveDto } from './leave.dto';
import { IsLeaveValid } from './validators/is-leave-valid.validator';

export class CreateEmployeeDto implements ICreateEmployeeDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  surname: string;

  @IsString()
  @Length(11, 11)
  @IsPesel()
  pesel: string;

  @IsString()
  @Length(1, 255)
  position: string;

  @IsEnum(Location)
  location: Location;

  @IsString()
  @MinLength(1)
  company: string;

  @IsInt()
  @Min(1)
  @Max(8)
  workHours: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkScheduleDto)
  workSchedule: WorkScheduleDto;

  @Type(() => Date)
  @IsDate()
  employmentDate: Date;

  @IsEnum(ContractType)
  contractType: ContractType;

  @ValidateNested()
  @Type(() => LeaveDto)
  @IsNotEmptyObject({}, { message: 'Leave is required' })
  @IsLeaveValid()
  leave: LeaveDto;
}
