import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  Controller,
} from "react-hook-form";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Location } from "@/types";
import { EmployeeFormValues } from "../employee.schema";
import { PositionInput } from "../Inputs/PositionInput";
import { AddEmployeeFormProps } from "./AddEmployeeForm.types";

export function AddEmployeeForm({
  register,
  control,
  errors,
  handleSubmit,
  handleFormSubmit,
  handleModalClose,
  companies,
  isLoadingCompanies,
  availableStartHours,
}: AddEmployeeFormProps) {
  const scheduleErrors = errors.workSchedule as Record<string, any> | undefined;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 mt-2"
      noValidate
    >
      <div className="grid grid-cols-3 gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel className="text-xs text-zinc-600">
            Imię <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            placeholder="Imię"
            {...register("name")}
            aria-invalid={!!errors.name}
            className="border-zinc-300 data-[invalid=true]:border-red-500"
          />
          {errors.name && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.name.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.surname}>
          <FieldLabel className="text-xs text-zinc-600">
            Nazwisko <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            placeholder="Nazwisko"
            {...register("surname")}
            aria-invalid={!!errors.surname}
            className="border-zinc-300 data-[invalid=true]:border-red-500"
          />
          {errors.surname && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.surname.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.pesel}>
          <FieldLabel className="text-xs text-zinc-600">
            PESEL <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            placeholder="11 cyfr"
            maxLength={11}
            {...register("pesel", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
              },
            })}
            aria-invalid={!!errors.pesel}
            className="border-zinc-300 font-mono data-[invalid=true]:border-red-500"
          />
          {errors.pesel && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.pesel.message)}
            </FieldDescription>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <Field data-invalid={!!errors.position}>
          <FieldLabel className="text-xs text-zinc-600">
            Stanowisko <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="position"
            render={({ field }) => (
              <PositionInput
                value={field.value}
                onChange={field.onChange}
                isInvalid={!!errors.position}
              />
            )}
          />
          {errors.position && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.position.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.location}>
          <FieldLabel className="text-xs text-zinc-600">
            Lokalizacja <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <div
                aria-invalid={!!errors.location}
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
            )}
          />
          {errors.location && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.location.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.company}>
          <FieldLabel className="text-xs text-zinc-600">
            Firma <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="company"
            render={({ field }) => {
              const selectedCompany = companies.find(
                (c) => c.id === field.value,
              );
              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={!!errors.company}
                    className="border-zinc-300 text-zinc-900 w-full overflow-hidden data-[invalid=true]:border-red-500"
                  >
                    <SelectValue
                      placeholder={
                        isLoadingCompanies ? "Ładowanie..." : "Wybierz firmę..."
                      }
                    >
                      <span className="block truncate">
                        {selectedCompany ? selectedCompany.name : field.value}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200 text-zinc-900">
                    {companies.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id}>
                        {comp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.company && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.company.message)}
            </FieldDescription>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <Field data-invalid={!!errors.workHours}>
          <FieldLabel className="text-xs text-zinc-600">
            Wymiar etatu <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="workHours"
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <SelectTrigger
                  aria-invalid={!!errors.workHours}
                  className="border-zinc-300 text-zinc-900 w-full data-[invalid=true]:border-red-500"
                >
                  <SelectValue placeholder="Wybierz etat..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200 text-zinc-900">
                  {[
                    { value: 4, label: "1/2 (4h)" },
                    { value: 6, label: "3/4 (6h)" },
                    { value: 7, label: "7/8 (7h)" },
                    { value: 8, label: "Pełen etat" },
                  ].map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.workHours && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.workHours.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!scheduleErrors?.start}>
          <FieldLabel className="text-xs text-zinc-600">
            Godzina startu (6:00 - 15:00){" "}
            <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="workSchedule.start"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  aria-invalid={!!scheduleErrors?.start}
                  className="border-zinc-300 text-zinc-900 w-full data-[invalid=true]:border-red-500"
                >
                  <SelectValue placeholder="Wybierz start..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200 text-zinc-900 max-h-48">
                  {availableStartHours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {scheduleErrors?.start && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(scheduleErrors.start.message)}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!scheduleErrors?.end}>
          <FieldLabel className="text-xs text-zinc-600">
            Godzina końcowa <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            type="text"
            disabled
            {...register("workSchedule.end")}
            aria-invalid={!!scheduleErrors?.end}
            className="bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed font-medium"
          />
          {scheduleErrors?.end && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(scheduleErrors.end.message)}
            </FieldDescription>
          )}
        </Field>
      </div>

      {/* Rząd 4: Data rozpoczęcia, Typ umowy, Urlop */}
      <div className="grid grid-cols-3 gap-4 items-start">
        <Field data-invalid={!!errors.employmentDate}>
          <FieldLabel className="text-xs text-zinc-600">
            Data rozpoczęcia <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="employmentDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger>
                  <div
                    aria-invalid={!!errors.employmentDate}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white border border-zinc-300 rounded-md h-10 px-3 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center cursor-pointer data-[invalid=true]:border-red-500",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                    {field.value ? (
                      format(new Date(field.value), "d MMMM yyyy", {
                        locale: pl,
                      })
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
            )}
          />
          {errors.employmentDate && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.employmentDate.message)}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs text-zinc-600">Typ umowy</FieldLabel>
          <div className="flex h-10 w-full items-center rounded-md bg-zinc-100 px-3 border border-zinc-200 text-sm text-zinc-700 font-medium">
            UoP
          </div>
        </Field>

        <Field data-invalid={!!errors.leave}>
          <FieldLabel className="text-xs text-zinc-600">
            Urlop roczny <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="leave"
            render={({ field }) => (
              <div
                aria-invalid={!!errors.leave}
                className="flex h-10 w-full items-center rounded-md bg-zinc-100 p-1 border border-zinc-200 data-[invalid=true]:border-red-500"
              >
                <button
                  type="button"
                  onClick={() => field.onChange(20)}
                  className={cn(
                    "flex-1 h-full rounded text-xs font-medium transition-all flex items-center justify-center",
                    field.value === 20
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900",
                  )}
                >
                  20 dni
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(26)}
                  className={cn(
                    "flex-1 h-full rounded text-xs font-medium transition-all flex items-center justify-center",
                    field.value === 26
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900",
                  )}
                >
                  26 dni
                </button>
              </div>
            )}
          />
          {errors.leave && (
            <FieldDescription className="text-[11px] text-red-500 font-medium">
              {String(errors.leave.message)}
            </FieldDescription>
          )}
        </Field>
      </div>

      <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-zinc-200 bg-transparent">
        <Button
          type="button"
          variant="outline"
          onClick={handleModalClose}
          className="bg-transparent border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
        >
          Anuluj
        </Button>
        <Button type="submit">Dodaj</Button>
      </DialogFooter>
    </form>
  );
}
