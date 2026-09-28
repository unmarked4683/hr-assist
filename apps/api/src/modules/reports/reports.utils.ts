import { EmployeeEntity } from '../employees/entities/employee.entity';

export const getEmployeeSheetName = ({
  name,
  surname,
}: Pick<EmployeeEntity, 'name' | 'surname'>) => {
  return `${surname.toUpperCase()} ${name.charAt(0).toUpperCase()}.`;
};

export const getReportFileName = (
  { name, surname }: Pick<EmployeeEntity, 'name' | 'surname'>,
  year: number,
  month: number,
) => {
  return `${name.toLowerCase()}-${surname.toLowerCase()}-${year}-${month.toString().padStart(2, '0')}.xlsx`;
};
// andrzej-sliwa-2026-09.xlsx
