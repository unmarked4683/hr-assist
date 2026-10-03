import { Injectable } from '@nestjs/common';
import { Alignment, Borders, Cell, Style, Workbook, Worksheet } from 'exceljs';
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
import { CompanyEntity } from '../companies/entities/company.entity';
import { AddressEntity } from '../companies/entities/address.entity';

interface GenerateReportOptions {
  employee: EmployeeEntity;
  company: CompanyEntity;
  year: number;
  month: number;
  daysInMonth: Map<number, Day>;
}

const GREEN_COLOR: string = '#9FCE63';
const BLUE_COLOR: string = '#C2D6EC';
const YELLOW_COLOR: string = '#F5C242';

@Injectable()
export class ReportEngine {
  async generateEmployeeReportFile({
    employee,
    company,
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
    this.addCompanyTab(worksheet, company);
    this.addHoursTable(worksheet);

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

    worksheet.getCell('C2').border = border;
    worksheet.getCell('C3').border = border;
    worksheet.getCell('H3').border = border;
    worksheet.getCell('I3').border = border;
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

  private addCompanyTab(
    worksheet: Worksheet,
    { name, address, nip }: CompanyEntity,
  ) {
    //
    const rowsLabels: string[] = [
      name,
      getAddressLabel(address),
      getNipLabel(nip),
    ];

    rowsLabels.forEach((rowLabel, index) => {
      const rowNumber = index + 5;
      worksheet.mergeCells(`P${rowNumber}:T${rowNumber}`);
      const cell = worksheet.getCell(`P${rowNumber}`);
      cell.value = rowLabel;
      cell.style = {
        alignment: { horizontal: 'center' },
      };
    });

    worksheet.getCell('P5').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.getCell('P6').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.getCell('P7').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    };
  }

  private addHoursTable(worksheet: Worksheet): void {
    this.addHoursTableHeader(worksheet);
    this.addHoursTableBody(worksheet);
  }

  private addHoursTableHeader(worksheet: Worksheet): void {
    const rowStyles: Partial<Style> = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    const ranges = ['C10:F10', 'H10:L10', 'M10:W10'];
    ranges.forEach((range) => {
      worksheet.mergeCells(range);
    });

    const upperRowCells: Cell[] = [
      worksheet.getCell('C10'),
      worksheet.getCell('G10'),
      worksheet.getCell('H10'),
      worksheet.getCell('M10'),
    ];

    upperRowCells[0].value = 'Czas pracy do rozliczenia';
    upperRowCells[1].value = 'Faktyczny czas pracy';
    upperRowCells[2].value = 'Godziny przepracowane';
    upperRowCells[3].value = 'Nieobecności w pracy określone w godzinach';

    upperRowCells.forEach((cell) => {
      cell.style = rowStyles;
    });

    const rotatedAlignment: Partial<Alignment> = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const centerAlignment: Partial<Alignment> = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const labels: string[] = [
      'Dzień miesiąca',
      'Dzień tygodnia',
      'Godziny pracy od - do',
      'Nominalny czas pracy',
      'w godz.',
      'Nadliczbowe w dzień',
      'Nadliczbowe w nocy',
      'Soboty',
      'Niedziele i święta',
      'Pora nocna',
      'Urlop wypoczynkowy',
      'Urlop na żądanie',
      'Urlop macierzyński',
      'Urlop wychowawczy',
      'Urlop bezpłatny',
      'Choroba',
      'Opieka',
    ];

    let currentColumn: string = 'C';

    labels.forEach((label) => {
      worksheet.mergeCells(`${currentColumn}11:${currentColumn}12`);
      const cell = worksheet.getCell(`${currentColumn}11`);
      cell.value = label;
      cell.style = {
        ...rowStyles,
        alignment: rotatedAlignment,
      };
      currentColumn = String.fromCharCode(currentColumn.charCodeAt(0) + 1);
    });

    worksheet.mergeCells('T11:U11');
    let cell = worksheet.getCell('T11');
    cell.value = 'Zwolnienia';
    cell.style = {
      ...rowStyles,
      alignment: centerAlignment,
    };

    cell = worksheet.getCell('T12');
    cell.value = 'Płatne';
    cell.style = {
      ...rowStyles,
      alignment: centerAlignment,
    };

    cell = worksheet.getCell('U12');
    cell.value = 'Niepłatne';
    cell.style = {
      ...rowStyles,
      alignment: centerAlignment,
    };

    worksheet.mergeCells('V11:V12');
    cell = worksheet.getCell('V11');
    cell.value = 'Nieobecność nieusprawiedliwiona';
    cell.style = {
      ...rowStyles,
      alignment: rotatedAlignment,
    };

    worksheet.mergeCells('W11:W12');
    cell = worksheet.getCell('W11');
    cell.value = 'Służba wojskowa';
    cell.style = {
      ...rowStyles,
      alignment: rotatedAlignment,
    };

    const cellsWithColor: CellWithColor[] = [
      {
        id: 'M11',
        color: GREEN_COLOR,
      },
      {
        id: 'N11',
        color: GREEN_COLOR,
      },
      {
        id: 'Q11',
        color: BLUE_COLOR,
      },
      {
        id: 'R11',
        color: YELLOW_COLOR,
      },
    ];
    cellsWithColor.forEach(({ id, color }) => {
      worksheet.getCell(id).fill = {
        type: 'pattern',
        pattern: 'solid',
        bgColor: {
          argb: color,
        },
      };
    });
  }

  private addHoursTableBody(worksheet: Worksheet): void {
    console.log(worksheet);
  }
}

interface EmployeeRow {
  title: string;
  content: string;
}

type CellWithColor = {
  id: string;
  color: string;
};

const getAddressLabel = ({
  street,
  houseNumber,
  postCode,
  city,
}: AddressEntity): string => {
  return `${street} ${houseNumber}, ${postCode} ${city}`;
};

const getNipLabel = (nip: string): string => {
  return `NIP: ${nip}`;
};

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
