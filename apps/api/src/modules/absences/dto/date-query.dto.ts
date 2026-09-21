import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const MIN_YEAR = 2026;

interface IDateQuery {
  year?: number;
  month?: number;
}

export class DateQueryDto implements IDateQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_YEAR)
  @Max(new Date().getFullYear() + 5)
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
