import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeaveDto } from './dto/leave.dto';

@Controller('employees/:employeeId/leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get('/')
  findLeaveForCurrentYear(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<LeaveDto> {
    return this.leavesService.findLeaveForCurrentYear(employeeId);
  }
}
