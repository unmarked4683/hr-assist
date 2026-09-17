import { EmployeeFormValues } from "../employee.schema";

export interface AddEmployeeFormProps {
  initialData?: Partial<EmployeeFormValues>;
  employeeId?: string;
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
}

export interface AddEmployeeFormHandle {
  reset: () => void;
}
