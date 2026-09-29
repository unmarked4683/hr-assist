import { Injectable } from '@nestjs/common';
import { Borders, Workbook, Worksheet } from 'exceljs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { Day } from './reports.types';
import { getEmployeeSheetName, getReportFileName } from './reports.utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ContractType, Location } from '../employees/employee.types';
import { Fraction } from 'fraction.js';

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

    this.addHeader(worksheet, year, month);
    this.addEmployeeTab(worksheet, employee);

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

  private addHeader(worksheet: Worksheet, year: number, month: number) {
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

    const border: Partial<Borders> = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.getCell('C2:I3').border = border;
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

  private addEmployeeTab(
    worksheet: Worksheet,
    {
      name,
      surname,
      pesel,
      contractType,
      position,
      location,
      workHours,
    }: EmployeeEntity,
  ) {
    const rows: EmployeeRow[] = [
      { title: 'Pracownik', content: `${name} ${surname}` },
      { title: 'Pesel', content: pesel },
      {
        title: 'Umowa',
        content: getContractTypeLabel({ contractType, workHours }),
      },
      {
        title: 'Stanowisko',
        content: getPositionLabel({ location, position }),
      },
    ];

    addRows(worksheet, rows);
  }
}

interface EmployeeRow {
  title: string;
  content: string;
}

const getContractTypeLabel = ({
  contractType,
  workHours,
}: Pick<EmployeeEntity, 'contractType' | 'workHours'>): string => {
  let label: string = `${contractType === ContractType.EMPLOYMENT_CONTRACT ? 'Umowa o pracę' : ''} `;

  if (workHours / 8 === 1) {
    label += '1 etat';
  } else {
    const fraction = new Fraction(workHours, 8);
    label += `${fraction.toString()} etatu`;
  }

  return label;
};

const getPositionLabel = ({
  location,
  position,
}: Pick<EmployeeEntity, 'position' | 'location'>): string => {
  let label: string = 'Pracownik ';

  if (location === Location.OFFICE) {
    label += 'biurowy';
  } else if (location === Location.PRODUCTION) {
    label += 'produkcji';
  }

  label += ' - ';

  const positionString: string =
    position.charAt(0).toUpperCase() + position.slice(1);

  label += positionString;

  return label;
};

const addRows = (worksheet: Worksheet, rows: EmployeeRow[]): void => {
  let currentRow: number = 5;
  const border: Partial<Borders> = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
  rows.forEach(({ content, title }) => {
    worksheet.mergeCells(`C${currentRow}:F${currentRow}`);
    const titleCell = worksheet.getCell(`C${currentRow}`);
    titleCell.value = title;
    titleCell.border = border;
    titleCell.font = { bold: true };

    worksheet.mergeCells(`G${currentRow}:N${currentRow}`);
    const contentCell = worksheet.getCell(`G${currentRow}`);
    contentCell.value = content;
    contentCell.border = border;
    contentCell.alignment = { horizontal: 'center' };

    currentRow++;
  });
};
