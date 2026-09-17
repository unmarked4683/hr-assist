import { EmployeeFormValues } from "../employee.schema";

export interface FormProps {
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
}

export interface FormHandle {
  reset: () => void;
}
