import { Controller } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth()
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}
}
