import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { EmployeeFormValues } from "../employee.schema";

export interface Company {
  id: string;
  name: string;
}

export interface AddEmployeeFormProps {
  register: UseFormRegister<EmployeeFormValues>;
  control: Control<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
  handleSubmit: UseFormHandleSubmit<EmployeeFormValues>;
  handleFormSubmit: (data: EmployeeFormValues) => void;
  handleModalClose: () => void;
  companies: Company[];
  isLoadingCompanies: boolean;
  availableStartHours: string[];
}
