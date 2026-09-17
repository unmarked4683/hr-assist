import { useController, useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { EmployeeFormValues } from "../employee.schema";

const WORK_HOURS_OPTIONS = [
  { value: 4, label: "1/2 (4h)" },
  { value: 6, label: "3/4 (6h)" },
  { value: 7, label: "7/8 (7h)" },
  { value: 8, label: "Pełen etat" },
] as const;

export function WorkHoursSelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "workHours" });
  const error = errors.workHours;
  const selectedOption = WORK_HOURS_OPTIONS.find(
    (option) => option.value === field.value,
  );

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Wymiar etatu <span className="text-destructive">*</span>
      </FieldLabel>
      <Select
        onValueChange={(val) => field.onChange(Number(val))}
        value={field.value?.toString()}
      >
        <SelectTrigger
          aria-invalid={!!error}
          className="border-zinc-300 text-zinc-900 w-full data-[invalid=true]:border-red-500"
        >
          <SelectValue placeholder="Wybierz etat...">
            {selectedOption ? selectedOption.label : "Wybierz etat..."}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="bg-white border-zinc-200 text-zinc-900"
          alignItemWithTrigger={false}
        >
          {WORK_HOURS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
