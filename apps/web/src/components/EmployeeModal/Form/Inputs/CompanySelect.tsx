import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import ms from "ms";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { ApiService } from "@/services/api.service";
import { EmployeeFormValues } from "../../employee.schema";
import { InputError } from "./InputError";
import { CompanyNameAndId } from "@/types";

function CompanySelectContent({ children }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side="bottom"
        sideOffset={4}
        align="center"
        alignItemWithTrigger={false}
        className="isolate z-100"
      >
        <SelectPrimitive.Popup className="relative z-100 max-h-(--available-height) w-(--anchor-width) min-w-36 overflow-x-hidden overflow-y-auto rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-md">
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function CompanySelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "company" });
  const error = errors.company;

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await ApiService.getCompaniesNamesAndIds(),
    staleTime: ms("5 minutes"),
  });

  useEffect(() => {
    if (!field.value && companies.length > 0) {
      field.onChange(companies[0].id);
    }
  }, [companies]);

  const selectedCompany = companies.find(
    (company) => company.id === field.value,
  );

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className="text-xs text-zinc-600">
        Firma <span className="text-destructive">*</span>
      </FieldLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger
          aria-invalid={!!error}
          className="border-zinc-300 text-zinc-900 w-full overflow-hidden"
        >
          <SelectValue
            placeholder={isLoading ? "Ładowanie..." : "Wybierz firmę..."}
          >
            <span className="block truncate">
              {selectedCompany ? selectedCompany.name : field.value}
            </span>
          </SelectValue>
        </SelectTrigger>
        <CompanySelectContent>
          {companies.map(({ id, name }: CompanyNameAndId) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </CompanySelectContent>
      </Select>
      <InputError message={error && String(error.message)} />
    </Field>
  );
}
