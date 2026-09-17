import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import ms from "ms";

import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ApiService } from "@/services/api.service";
import { EmployeeFormValues } from "../../employee.schema";

// SelectContent z ui/select.tsx renderuje Positioner na z-50, tym samym poziomie co
// DialogContent — w efekcie lista firm potrafiła chować się pod resztą formularza.
// Własny Positioner z wyższym z-index rozwiązuje kolizję warstw bez ingerencji w
// współdzielony komponent Shadcn.
function CompanySelectContent({ children }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side="bottom"
        sideOffset={4}
        align="center"
        alignItemWithTrigger={false}
        className="isolate z-[100]"
      >
        <SelectPrimitive.Popup className="relative z-[100] max-h-(--available-height) w-(--anchor-width) min-w-36 overflow-x-hidden overflow-y-auto rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-md">
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
    //! API: GET /api/companies
    queryFn: async () => await ApiService.getCompaniesNamesAndIds(),
    staleTime: ms("5 minutes"),
  });

  useEffect(() => {
    if (!field.value && companies.length > 0) {
      field.onChange(companies[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className="border-zinc-300 text-zinc-900 w-full overflow-hidden data-[invalid=true]:border-red-500"
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
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </CompanySelectContent>
      </Select>
      {error && (
        <FieldDescription className="text-[11px] text-red-500 font-medium">
          {String(error.message)}
        </FieldDescription>
      )}
    </Field>
  );
}
