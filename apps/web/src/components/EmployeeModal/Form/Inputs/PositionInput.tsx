import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ApiService } from "@/services/api.service";
import { EmployeeFormValues } from "../../employee.schema";

export function PositionInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "position" });
  const error = errors.position;

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["positions"],
    //! API: GET /api/employees/positions
    queryFn: async () => await ApiService.getPositions(),
    staleTime: ms("5 minutes"),
  });

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Stanowisko <span className="text-destructive">*</span>
      </FieldLabel>
      <Combobox
        items={positions}
        value={field.value || null}
        onValueChange={(val) => field.onChange(val ?? "")}
      >
        <ComboboxInput
          placeholder="Wpisz lub wybierz stanowisko..."
          aria-invalid={!!error}
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          className="border-zinc-300 text-zinc-900 bg-white data-[invalid=true]:border-red-500"
        />
        <ComboboxContent className="bg-white border-zinc-200 text-zinc-900 shadow-md">
          <ComboboxEmpty>
            {isLoading
              ? "Ładowanie..."
              : "Brak wyników (wpisany tekst zostanie użyty)."}
          </ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
