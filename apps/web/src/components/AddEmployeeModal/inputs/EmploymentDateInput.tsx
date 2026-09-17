import { useController, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { EmployeeFormValues } from "../employee.schema";

export function EmploymentDateInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "employmentDate" });
  const error = errors.employmentDate;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Data rozpoczęcia <span className="text-destructive">*</span>
      </FieldLabel>
      <Popover>
        <PopoverTrigger>
          <div
            aria-invalid={!!error}
            className={cn(
              "w-full justify-start text-left font-normal bg-white border border-zinc-300 rounded-md h-10 px-3 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center cursor-pointer data-[invalid=true]:border-red-500",
              !field.value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
            {field.value ? (
              format(new Date(field.value), "d MMMM yyyy", { locale: pl })
            ) : (
              <span>Wybierz datę</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border-zinc-200 text-zinc-900 shadow-md">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) =>
              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
            }
          />
        </PopoverContent>
      </Popover>
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
