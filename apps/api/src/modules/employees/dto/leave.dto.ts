import { IsInt, Min, Max } from 'class-validator';
import { ILeaveDto } from '../employee.types';

export class LeaveDto implements ILeaveDto {
  @IsInt()
  @Min(1)
  @Max(26)
  base: number;

  @IsInt()
  @Min(0)
  @Max(26)
  overdue: number;

  @IsInt()
  @Min(1)
  @Max(26)
  current: number;
}
