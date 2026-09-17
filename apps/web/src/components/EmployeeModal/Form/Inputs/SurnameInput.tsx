import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { EmployeeFormValues } from "../../employee.schema";

export function SurnameInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const error = errors.surname;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Nazwisko <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        placeholder="Nazwisko"
        {...register("surname")}
        aria-invalid={!!error}
        className="border-zinc-300 data-[invalid=true]:border-red-500"
      />
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
