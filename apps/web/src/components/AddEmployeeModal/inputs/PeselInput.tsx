import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { EmployeeFormValues } from "../employee.schema";

export function PeselInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const error = errors.pesel;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        PESEL <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        placeholder="11 cyfr"
        maxLength={11}
        {...register("pesel", {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
          },
        })}
        aria-invalid={!!error}
        className="border-zinc-300 font-mono data-[invalid=true]:border-red-500"
      />
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
