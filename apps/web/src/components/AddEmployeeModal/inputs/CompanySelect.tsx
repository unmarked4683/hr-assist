import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ApiService } from "@/services/api.service";
import { EmployeeFormValues } from "../employee.schema";

export function CompanySelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();
  const { field } = useController({ control, name: "company" });
  const error = errors.company;

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await ApiService.getCompanies(),
  });

  const selectedCompany = companies.find((company) => company.id === field.value);

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
        <SelectContent
          alignItemWithTrigger={false}
          className="bg-white border-zinc-200 text-zinc-900 shadow-md"
        >
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
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
