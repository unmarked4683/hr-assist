import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  EmployeeFormValues,
  employeeSchema,
  getDefaultEmployeeFormValues,
} from "../employee.schema";
import { NameInput } from "../inputs/NameInput";
import { SurnameInput } from "../inputs/SurnameInput";
import { PeselInput } from "../inputs/PeselInput";
import { PositionInput } from "../inputs/PositionInput";
import { LocationToggle } from "../inputs/LocationToggle";
import { CompanySelect } from "../inputs/CompanySelect";
import { WorkHoursSelect } from "../inputs/WorkHoursSelect";
import { WorkScheduleStartSelect } from "../inputs/WorkScheduleStartSelect";
import { WorkScheduleEndInput } from "../inputs/WorkScheduleEndInput";
import { EmploymentDateInput } from "../inputs/EmploymentDateInput";
import { ContractTypeField } from "../inputs/ContractTypeField";
import { LeaveToggle } from "../inputs/LeaveToggle";
import {
  AddEmployeeFormHandle,
  AddEmployeeFormProps,
} from "./AddEmployeeForm.types";

export const AddEmployeeForm = forwardRef<
  AddEmployeeFormHandle,
  AddEmployeeFormProps
>(function AddEmployeeForm({ initialData, employeeId, onSubmit, onCancel }, ref) {
  const isEditMode = Boolean(employeeId);

  const { data: fetchedEmployee } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async (): Promise<Partial<EmployeeFormValues> | null> => {
      // Mock — docelowo: GET /api/employees/:id
      console.log("Pobieram dane pracownika do edycji:", employeeId);
      return null;
    },
    enabled: isEditMode,
  });

  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: getDefaultEmployeeFormValues(initialData),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (fetchedEmployee) {
      reset(getDefaultEmployeeFormValues(fetchedEmployee));
    }
  }, [fetchedEmployee, reset]);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => reset(getDefaultEmployeeFormValues(initialData)),
    }),
    [reset, initialData],
  );

  const handleCancel = () => {
    reset(getDefaultEmployeeFormValues(initialData));
    onCancel();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mt-2"
        noValidate
      >
        <div className="grid grid-cols-3 gap-4">
          <NameInput />
          <SurnameInput />
          <PeselInput />
        </div>

        <div className="grid grid-cols-3 gap-4 items-start">
          <PositionInput />
          <LocationToggle />
          <CompanySelect />
        </div>

        <div className="grid grid-cols-3 gap-4 items-start">
          <WorkHoursSelect />
          <WorkScheduleStartSelect />
          <WorkScheduleEndInput />
        </div>

        <div className="grid grid-cols-3 gap-4 items-start">
          <EmploymentDateInput />
          <ContractTypeField />
          <LeaveToggle />
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-zinc-200 bg-transparent">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
          >
            Anuluj
          </Button>
          <Button type="submit">{isEditMode ? "Zapisz zmiany" : "Dodaj"}</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
});
