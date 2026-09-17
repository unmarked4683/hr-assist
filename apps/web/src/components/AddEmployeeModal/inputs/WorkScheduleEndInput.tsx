import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { addHours, format, parse } from "date-fns";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { EmployeeFormValues } from "../employee.schema";

export function WorkScheduleEndInput() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const error = errors.workSchedule?.end;
  const start = watch("workSchedule.start");
  const workHours = watch("workHours");

  useEffect(() => {
    if (!start || !workHours) return;
    try {
      const parsedStart = parse(start, "HH:00", new Date());
      const end = addHours(parsedStart, Number(workHours));
      setValue("workSchedule.end", format(end, "HH:00"));
    } catch {}
  }, [start, workHours, setValue]);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Godzina końcowa <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        type="text"
        disabled
        {...register("workSchedule.end")}
        aria-invalid={!!error}
        className="bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed font-medium"
      />
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
