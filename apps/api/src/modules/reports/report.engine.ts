import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { Day } from './reports.types';
import { getEmployeeSheetName, getReportFileName } from './reports.utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface GenerateReportOptions {
  employee: EmployeeEntity;
  year: number;
  month: number;
  daysInMonth: Map<number, Day>;
}

@Injectable()
export class ReportEngine {
  async generateEmployeeReportFile({
    employee,
    year,
    month,
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    daysInMonth,
  }: GenerateReportOptions): Promise<void> {
    const workbook = new Workbook();
    const worksheet = this.buildWorkSheet(employee, workbook);

    this.buildHeader(worksheet, year, month);

    await this.saveWorkbook(employee, year, month, workbook);
  }

  private buildWorkSheet(
    employee: EmployeeEntity,
    workbook: Workbook,
  ): Worksheet {
    const sheetName = getEmployeeSheetName(employee);
    const worksheet = workbook.addWorksheet(sheetName);

    return worksheet;
  }

  private buildHeader(worksheet: Worksheet, year: number, month: number) {
    worksheet.mergeCells('C2:I2');
    const titleCell = worksheet.getCell('C2');
    titleCell.value = 'Miesięczna ewidencja czasu pracy';
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('C3:G3');
    const subtitleCell = worksheet.getCell('C3');
    subtitleCell.value = 'za miesiąc';
    const monthCell = worksheet.getCell('H3');
    const monthName = format(new Date(year, month - 1, 1), 'LLLL', {
      locale: pl,
    });
    monthCell.value = monthName;
    monthCell.alignment = { horizontal: 'center' };
    const yearCell = worksheet.getCell('I3');
    yearCell.value = year;
    yearCell.alignment = { horizontal: 'center' };
  }

  private async saveWorkbook(
    employee: EmployeeEntity,
    year: number,
    month: number,
    workbook: Workbook,
  ) {
    const reportsDir = join(cwd(), 'reports');
    await mkdir(reportsDir, { recursive: true });

    const fileName = getReportFileName(employee, year, month);
    const filePath = join(reportsDir, fileName);

    await workbook.xlsx.writeFile(filePath);
  }
}
