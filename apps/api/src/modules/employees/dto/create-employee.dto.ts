import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ContractType, ICreateEmployeeDto, Location } from '../employee.types';

export class CreateEmployeeDto implements ICreateEmployeeDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  surname: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'pesel must contain exactly 11 digits' })
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

  @IsString()
  @MinLength(1)
  workSchedule: string;

  @Type(() => Date)
  @IsDate()
  employmentDate: Date;

  @IsEnum(ContractType)
  contractType: ContractType;
}
