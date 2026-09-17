import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { EmployeeFormValues } from "../employee.schema";

export function NameInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const error = errors.name;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Imię <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        placeholder="Imię"
        {...register("name")}
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
