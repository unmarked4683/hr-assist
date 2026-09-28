import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetMonthReportParamsDto } from './dto/get-month-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/:employeeId/:year/:month')
  getMonthReportForSingleEmployee(
    @Param() getMonthReportDto: GetMonthReportParamsDto,
  ) {
    return this.reportsService.getMonthReportForSingleEmployee(
      getMonthReportDto,
    );
  }
}
