import { Injectable } from '@nestjs/common';
import {
  Alignment,
  Borders,
  Cell,
  Fill,
  Style,
  Workbook,
  Worksheet,
} from 'exceljs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { Day } from './reports.types';
import { AttendanceStatus } from '../attendance/attendance.types';
import { getEmployeeSheetName, getReportFileName } from './reports.utils';
import { format, getDaysInMonth } from 'date-fns';
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
const GREY_COLOR: string = '#D9D9D9';

const EMPLOYEE_TAB_START_ROW: number = 5;
const TABLE_START_ROW: number = 13;
const WORK_START_HOUR: number = 8;
const FORMAT_DASH_ZERO: string = '0;-0;"-"';
const FORMAT_NUMBER: string = '0';
const ZERO_VALUE_FONT_COLOR: string = 'FF888888';

const FIRST_TABLE_COLUMN: string = 'C';
const LAST_TABLE_COLUMN: string = 'W';
const LAST_WORKED_HOURS_COLUMN: string = 'L';
const FIRST_ABSENCE_COLUMN: string = 'M';

const ABSENCE_STATUS_COLUMNS: Record<string, string> = {
  [AttendanceStatus.VACATION_LEAVE]: 'M',
  [AttendanceStatus.ON_DEMAND_LEAVE]: 'N',
  [AttendanceStatus.MATERNITY_LEAVE]: 'O',
  [AttendanceStatus.PARENTAL_LEAVE]: 'P',
  [AttendanceStatus.PARENTAL_CHILD_LEAVE]: 'P',
  [AttendanceStatus.UNPAID_LEAVE]: 'Q',
  [AttendanceStatus.SICK_LEAVE]: 'R',
  [AttendanceStatus.CARE]: 'S',
  [AttendanceStatus.PAID_EXCUSED_ABSENCE]: 'T',
  [AttendanceStatus.UNPAID_EXCUSED_ABSENCE]: 'U',
  [AttendanceStatus.UNEXCUSED_ABSENCE]: 'V',
  [AttendanceStatus.PATERNITY_LEAVE]: 'P',
  [AttendanceStatus.CIRCUMSTANTIAL_LEAVE]: 'T',
  [AttendanceStatus.DAY_OFF_FOR_HOLIDAY]: 'T',
  [AttendanceStatus.REHABILITATION_BENEFIT]: 'R',
};

const WORKDAY_COLUMN_COLORS: Record<string, string> = {
  M: GREEN_COLOR,
  N: GREEN_COLOR,
  Q: BLUE_COLOR,
  R: YELLOW_COLOR,
};

const WEEKDAY_LABELS: string[] = [
  'Nd.',
  'Pon.',
  'Wt.',
  'Śr.',
  'Czw.',
  'Pt.',
  'Sob.',
];

const THIN_BORDER: Partial<Borders> = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
};

const CENTER_ALIGNMENT: Partial<Alignment> = {
  vertical: 'middle',
  horizontal: 'center',
};

const WRAPPED_CENTER_ALIGNMENT: Partial<Alignment> = {
  ...CENTER_ALIGNMENT,
  wrapText: true,
};

const ROTATED_ALIGNMENT: Partial<Alignment> = {
  ...WRAPPED_CENTER_ALIGNMENT,
  textRotation: 90,
};

// Columns wide enough to keep their header labels horizontal
const HORIZONTAL_HEADER_COLUMNS: string[] = ['D', 'E', 'G'];

// Rows 11-12 hold rotated labels, so together they must fit the longest word
const HEADER_ROW_HEIGHTS: Record<number, number> = {
  10: 30,
  11: 60,
  12: 65,
};

const COLUMN_WIDTHS: Record<string, number> = {
  A: 11,
  C: 4,
  // exceljs skips writing width 9 (its internal default), Excel would use 8.43
  D: 9.14,
  E: 11,
  F: 7,
  G: 7,
  H: 6,
  I: 6,
  J: 6,
  K: 6,
  L: 6,
  M: 7,
  N: 7,
  O: 7,
  P: 7,
  Q: 7,
  R: 7,
  S: 7,
  T: 7,
  U: 7,
  V: 7,
  W: 7,
};

const A4_PAPER_SIZE: number = 9;

@Injectable()
export class ReportEngine {
  async generateEmployeeReportFile({
    employee,
    company,
    year,
    month,
    daysInMonth,
  }: GenerateReportOptions): Promise<void> {
    const workbook = new Workbook();
    const worksheet = this.buildWorkSheet(employee, workbook);

    this.addHeader(worksheet, year, month);
    this.addEmployeeTab(worksheet, employee);
    this.addCompanyTab(worksheet, company);
    this.addHoursTable(worksheet, {
      year,
      month,
      daysInMonth,
      workHours: employee.workHours,
    });

    await this.saveWorkbook(employee, year, month, workbook);
  }

  private buildWorkSheet(
    employee: EmployeeEntity,
    workbook: Workbook,
  ): Worksheet {
    const sheetName = getEmployeeSheetName(employee);
    const worksheet = workbook.addWorksheet(sheetName);

    this.setColumnWidths(worksheet);
    this.setPrintLayout(worksheet);

    return worksheet;
  }

  private setColumnWidths(worksheet: Worksheet): void {
    Object.entries(COLUMN_WIDTHS).forEach(([column, width]) => {
      worksheet.getColumn(column).width = width;
    });
  }

  private setPrintLayout(worksheet: Worksheet): void {
    worksheet.pageSetup = {
      orientation: 'landscape',
      paperSize: A4_PAPER_SIZE,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.3,
        right: 0.3,
        top: 0.4,
        bottom: 0.4,
        header: 0.2,
        footer: 0.2,
      },
    };
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

    this.applyBorderToRange(
      worksheet,
      2,
      columnNumber('C'),
      3,
      columnNumber('I'),
    );
  }

  // Merged cells only render a full border when every underlying cell has it
  private applyBorderToRange(
    worksheet: Worksheet,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    border: Partial<Borders> = THIN_BORDER,
  ): void {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        worksheet.getCell(row, col).border = border;
      }
    }
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

    this.applyBorderToRange(
      worksheet,
      EMPLOYEE_TAB_START_ROW,
      columnNumber('C'),
      EMPLOYEE_TAB_START_ROW + rows.length - 1,
      columnNumber('N'),
    );
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

    this.applyBorderToRange(
      worksheet,
      5,
      columnNumber('P'),
      4 + rowsLabels.length,
      columnNumber('T'),
    );
  }

  private addHoursTable(
    worksheet: Worksheet,
    options: HoursTableOptions,
  ): void {
    this.addHoursTableHeader(worksheet);
    this.addHoursTableBody(worksheet, options);
  }

  private addHoursTableHeader(worksheet: Worksheet): void {
    const rowStyles: Partial<Style> = {
      font: { bold: true },
      alignment: WRAPPED_CENTER_ALIGNMENT,
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

    Object.entries(HEADER_ROW_HEIGHTS).forEach(([rowNumber, height]) => {
      worksheet.getRow(Number(rowNumber)).height = height;
    });

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
        alignment: getHeaderAlignment(currentColumn),
      };
      currentColumn = String.fromCharCode(currentColumn.charCodeAt(0) + 1);
    });

    worksheet.mergeCells('T11:U11');
    let cell = worksheet.getCell('T11');
    cell.value = 'Zwolnienia';
    cell.style = {
      ...rowStyles,
      alignment: WRAPPED_CENTER_ALIGNMENT,
    };

    cell = worksheet.getCell('T12');
    cell.value = 'Płatne';
    cell.style = {
      ...rowStyles,
      alignment: ROTATED_ALIGNMENT,
    };

    cell = worksheet.getCell('U12');
    cell.value = 'Niepłatne';
    cell.style = {
      ...rowStyles,
      alignment: ROTATED_ALIGNMENT,
    };

    worksheet.mergeCells('V11:V12');
    cell = worksheet.getCell('V11');
    cell.value = 'Nieobecność nieusprawiedliwiona';
    cell.style = {
      ...rowStyles,
      alignment: ROTATED_ALIGNMENT,
    };

    worksheet.mergeCells('W11:W12');
    cell = worksheet.getCell('W11');
    cell.value = 'Służba wojskowa';
    cell.style = {
      ...rowStyles,
      alignment: ROTATED_ALIGNMENT,
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
      worksheet.getCell(id).fill = getSolidFill(color);
    });

    this.applyBorderToRange(
      worksheet,
      10,
      columnNumber(FIRST_TABLE_COLUMN),
      TABLE_START_ROW - 1,
      columnNumber(LAST_TABLE_COLUMN),
    );
  }

  private addHoursTableBody(
    worksheet: Worksheet,
    { year, month, daysInMonth, workHours }: HoursTableOptions,
  ): void {
    const totalDays: number = getDaysInMonth(new Date(year, month - 1));

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dayInfo: Day | undefined = daysInMonth.get(dayNum);

      if (!dayInfo) {
        throw new Error(`Missing attendance data for day ${dayNum}`);
      }

      this.addDayRow(worksheet, {
        rowNumber: TABLE_START_ROW + dayNum - 1,
        date: new Date(year, month - 1, dayNum),
        dayInfo,
        workHours,
      });
    }

    const lastDataRow: number = TABLE_START_ROW - 1 + totalDays;

    this.addZeroValuesFormatting(worksheet, lastDataRow);
    this.addSummaryRow(worksheet, lastDataRow);
  }

  private addZeroValuesFormatting(
    worksheet: Worksheet,
    lastDataRow: number,
  ): void {
    worksheet.addConditionalFormatting({
      ref: `${FIRST_ABSENCE_COLUMN}${TABLE_START_ROW}:${LAST_TABLE_COLUMN}${lastDataRow}`,
      rules: [
        {
          type: 'cellIs',
          operator: 'equal',
          formulae: ['0'],
          priority: 1,
          style: {
            font: { color: { argb: ZERO_VALUE_FONT_COLOR } },
          },
        },
      ],
    });
  }

  private addDayRow(
    worksheet: Worksheet,
    { rowNumber, date, dayInfo, workHours }: DayRowOptions,
  ): void {
    const row = worksheet.getRow(rowNumber);
    const isHoliday: boolean = dayInfo.status === AttendanceStatus.HOLIDAY;

    let dayLabel: string = WEEKDAY_LABELS[date.getDay()];
    if (dayInfo.status === AttendanceStatus.HOLIDAY && dayInfo.name) {
      dayLabel = dayInfo.name as string;
    }

    row.getCell('A').value = format(date, 'dd/MM/yyyy');
    row.getCell('C').value = date.getDate();
    row.getCell('D').value = dayLabel;

    // Hour cells always hold numbers so SUM formulas work; zeros render as '-'
    forEachColumn('E', LAST_TABLE_COLUMN, (column) => {
      const cell = row.getCell(column);
      cell.value = 0;
      cell.numFmt = FORMAT_DASH_ZERO;
    });

    if (!isHoliday) {
      // On workdays worked hours show a plain 0, absences keep the dash
      forEachColumn('F', LAST_WORKED_HOURS_COLUMN, (column) => {
        row.getCell(column).numFmt = FORMAT_NUMBER;
      });

      const isPresent: boolean = dayInfo.status === AttendanceStatus.PRESENCE;
      const absenceColumn: string | undefined =
        ABSENCE_STATUS_COLUMNS[dayInfo.status as string];

      row.getCell('E').value = getWorkHoursRangeLabel(workHours);
      row.getCell('F').value = workHours;

      if (isPresent) {
        row.getCell('G').value = workHours;
      } else if (absenceColumn) {
        row.getCell(absenceColumn).value = workHours;
      }
    }

    forEachColumn(FIRST_TABLE_COLUMN, LAST_TABLE_COLUMN, (column) => {
      const cell = row.getCell(column);
      cell.border = THIN_BORDER;
      cell.alignment = CENTER_ALIGNMENT;

      const color: string | undefined = isHoliday
        ? GREY_COLOR
        : WORKDAY_COLUMN_COLORS[column];
      if (color) {
        cell.fill = getSolidFill(color);
      }
    });
  }

  private addSummaryRow(worksheet: Worksheet, lastDataRow: number): void {
    const summaryRow: number = lastDataRow + 1;

    worksheet.mergeCells(`C${summaryRow}:E${summaryRow}`);
    worksheet.getCell(`C${summaryRow}`).value = 'RAZEM';

    forEachColumn('F', LAST_TABLE_COLUMN, (column) => {
      const cell = worksheet.getCell(`${column}${summaryRow}`);
      cell.value = {
        formula: `SUM(${column}${TABLE_START_ROW}:${column}${lastDataRow})`,
      };
      cell.numFmt = FORMAT_NUMBER;
    });

    forEachColumn(FIRST_TABLE_COLUMN, LAST_TABLE_COLUMN, (column) => {
      const cell = worksheet.getCell(`${column}${summaryRow}`);
      cell.font = { bold: true };
      cell.alignment = CENTER_ALIGNMENT;
    });

    this.applyBorderToRange(
      worksheet,
      summaryRow,
      columnNumber(FIRST_TABLE_COLUMN),
      summaryRow,
      columnNumber(LAST_TABLE_COLUMN),
    );
  }
}

interface HoursTableOptions {
  year: number;
  month: number;
  daysInMonth: Map<number, Day>;
  workHours: number;
}

interface DayRowOptions {
  rowNumber: number;
  date: Date;
  dayInfo: Day;
  workHours: number;
}

interface EmployeeRow {
  title: string;
  content: string;
}

type CellWithColor = {
  id: string;
  color: string;
};

const forEachColumn = (
  from: string,
  to: string,
  callback: (column: string) => void,
): void => {
  for (let code = from.charCodeAt(0); code <= to.charCodeAt(0); code++) {
    callback(String.fromCharCode(code));
  }
};

// exceljs expects ARGB colors without '#', solid fills read fgColor
const getSolidFill = (hexColor: string): Fill => ({
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: `FF${hexColor.replace('#', '')}` },
});

const columnNumber = (column: string): number =>
  column.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

const getHeaderAlignment = (column: string): Partial<Alignment> =>
  HORIZONTAL_HEADER_COLUMNS.includes(column)
    ? WRAPPED_CENTER_ALIGNMENT
    : ROTATED_ALIGNMENT;

const getWorkHoursRangeLabel = (workHours: number): string =>
  `${WORK_START_HOUR}:00-${WORK_START_HOUR + workHours}:00`;

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
  let currentRow: number = EMPLOYEE_TAB_START_ROW;
  rows.forEach(({ content, title }) => {
    worksheet.mergeCells(`C${currentRow}:F${currentRow}`);
    const titleCell = worksheet.getCell(`C${currentRow}`);
    titleCell.value = title;
    titleCell.font = { bold: true };

    worksheet.mergeCells(`G${currentRow}:N${currentRow}`);
    const contentCell = worksheet.getCell(`G${currentRow}`);
    contentCell.value = content;
    contentCell.alignment = { horizontal: 'center' };

    currentRow++;
  });
};
