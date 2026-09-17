import { useController, useFormContext } from "react-hook-form";

import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Location } from "@/types";
import { EmployeeFormValues } from "../../employee.schema";

export function LocationToggle() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "location" });
  const error = errors.location;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Lokalizacja <span className="text-destructive">*</span>
      </FieldLabel>
      <div
        aria-invalid={!!error}
        className="flex h-10 w-full items-center rounded-md bg-zinc-100 p-1 border border-zinc-200 data-[invalid=true]:border-red-500"
      >
        <button
          type="button"
          onClick={() => field.onChange(Location.OFFICE)}
          className={cn(
            "flex-1 h-full rounded text-xs font-medium transition-all flex items-center justify-center",
            field.value === Location.OFFICE
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900",
          )}
        >
          Biuro
        </button>
        <button
          type="button"
          onClick={() => field.onChange(Location.PRODUCTION)}
          className={cn(
            "flex-1 h-full rounded text-xs font-medium transition-all flex items-center justify-center",
            field.value === Location.PRODUCTION
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900",
          )}
        >
          Hala
        </button>
      </div>
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
