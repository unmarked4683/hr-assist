import { Ref } from "react";
import { EmployeeFormValues } from "../employee.schema";

export interface FormProps {
  ref?: Ref<FormHandle>;
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
}

export interface FormHandle {
  reset: () => void;
}
