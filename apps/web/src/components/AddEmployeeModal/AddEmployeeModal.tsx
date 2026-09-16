"use client";

import { ApiService } from "@/services/api.service";
import { ContractType, AddEmployeeDto, Location } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { addHours, format, parse } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { EmployeeFormValues, employeeSchema } from "./employee.schema";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [pendingData, setPendingData] = useState<EmployeeFormValues | null>(
    null,
  );

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await ApiService.getCompanies(),
    enabled: isOpen,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      pesel: "",
      position: "",
      location: Location.OFFICE,
      company: "",
      workHours: 8,
      workSchedule: {
        start: "08:00",
        end: "16:00",
      },
      employmentDate: new Date().toISOString().split("T")[0],
      contractType: ContractType.EMPLOYMENT_CONTRACT,
      leave: 20,
    },
  });

  const employeeMutation = useMutation({
    mutationFn: async (employee: AddEmployeeDto) => {
      return await ApiService.addEmployee(employee);
    },
    onSuccess: () => {
      toast.success("Pracownik dodany pomyślnie");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Błąd podczas dodawania pracownika");
    },
  });

  const watchStart = watch("workSchedule.start");
  const watchWorkHours = watch("workHours");

  useEffect(() => {
    if (watchStart && watchWorkHours) {
      try {
        const parsedDate = parse(watchStart, "HH:00", new Date());
        const endDate = addHours(parsedDate, Number(watchWorkHours));
        setValue("workSchedule.end", format(endDate, "HH:00"));
      } catch {}
    }
  }, [watchStart, watchWorkHours, setValue]);

  const availableStartHours = useMemo(() => {
    const hours = [];
    const maxStart = Math.min(15, 16 - (Number(watchWorkHours) || 8));
    for (let i = 6; i <= maxStart; i++) {
      const hourStr = i < 10 ? `0${i}:00` : `${i}:00`;
      hours.push(hourStr);
    }
    return hours;
  }, [watchWorkHours]);

  const handleFormSubmit = (data: EmployeeFormValues) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const confirmAddEmployee = () => {
    if (!pendingData) return;
    employeeMutation.mutate(pendingData as unknown as AddEmployeeDto);
    setIsConfirmOpen(false);
    onClose();
    reset();
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && handleModalClose()}
      >
        <DialogContent className="sm:max-w-4xl bg-white text-zinc-900 border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-wide">
              Dodawanie pracownika
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-2"
          >
            {/* Rząd 1 */}
            <div className="grid grid-cols-3 gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs text-zinc-600">Imię</FieldLabel>
                <Input
                  placeholder="Imię"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  className="border-zinc-300"
                />
                {errors.name && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.surname}>
                <FieldLabel className="text-xs text-zinc-600">
                  Nazwisko
                </FieldLabel>
                <Input
                  placeholder="Nazwisko"
                  {...register("surname")}
                  aria-invalid={!!errors.surname}
                  className="border-zinc-300"
                />
                {errors.surname && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.surname.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.pesel}>
                <FieldLabel className="text-xs text-zinc-600">PESEL</FieldLabel>
                <Input
                  placeholder="PESEL"
                  {...register("pesel")}
                  aria-invalid={!!errors.pesel}
                  className="border-zinc-300"
                />
                {errors.pesel && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.pesel.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            {/* Rząd 2 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <Field data-invalid={!!errors.position}>
                <FieldLabel className="text-xs text-zinc-600">
                  Stanowisko
                </FieldLabel>
                <Input
                  placeholder="Stanowisko"
                  {...register("position")}
                  aria-invalid={!!errors.position}
                  className="border-zinc-300"
                />
                {errors.position && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.position.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.location}>
                <FieldLabel className="text-xs text-zinc-600">
                  Lokalizacja
                </FieldLabel>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <div className="flex h-10 w-full items-center rounded-md bg-zinc-100 p-1 border border-zinc-200">
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
                    {errors.location.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.company}>
                <FieldLabel className="text-xs text-zinc-600">Firma</FieldLabel>
                <Controller
                  control={control}
                  name="company"
                  render={({ field }) => {
                    const selectedCompany = companies.find(
                      (c) => c.id === field.value,
                    );
                    return (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          aria-invalid={!!errors.company}
                          className="border-zinc-300 text-zinc-900 w-full overflow-hidden"
                        >
                          <SelectValue
                            placeholder={
                              isLoadingCompanies
                                ? "Ładowanie..."
                                : "Wybierz firmę..."
                            }
                          >
                            <span className="block truncate">
                              {selectedCompany
                                ? selectedCompany.name
                                : field.value}
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
                    {errors.company.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            {/* Rząd 3 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <Field data-invalid={!!errors.workHours}>
                <FieldLabel className="text-xs text-zinc-600">
                  Wymiar etatu
                </FieldLabel>
                <Controller
                  control={control}
                  name="workHours"
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="border-zinc-300 text-zinc-900 w-full">
                        <SelectValue placeholder="Wybierz etat..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200 text-zinc-900">
                        <SelectItem value="4">1/2 (4h)</SelectItem>
                        <SelectItem value="6">3/4 (6h)</SelectItem>
                        <SelectItem value="7">7/8 (7h)</SelectItem>
                        <SelectItem value="8">Pełen etat</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.workHours && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.workHours.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.workSchedule?.start}>
                <FieldLabel className="text-xs text-zinc-600">
                  Godzina startu (6:00 - 15:00)
                </FieldLabel>
                <Controller
                  control={control}
                  name="workSchedule.start"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        aria-invalid={!!errors.workSchedule?.start}
                        className="border-zinc-300 text-zinc-900 w-full"
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
                {errors.workSchedule?.start && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.workSchedule.start.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.workSchedule?.end}>
                <FieldLabel className="text-xs text-zinc-600">
                  Godzina końca (Auto)
                </FieldLabel>
                <Input
                  type="text"
                  disabled
                  {...register("workSchedule.end")}
                  aria-invalid={!!errors.workSchedule?.end}
                  className="bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed font-medium"
                />
                {errors.workSchedule?.end && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.workSchedule.end.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4 items-start">
              <Field data-invalid={!!errors.employmentDate}>
                <FieldLabel className="text-xs text-zinc-600">
                  Data rozpoczęcia
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
                            "w-full justify-start text-left font-normal bg-white border border-zinc-300 rounded-md h-10 px-3 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center cursor-pointer",
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : "",
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.employmentDate && (
                  <FieldDescription className="text-[11px] text-red-500 font-medium">
                    {errors.employmentDate.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xs text-zinc-600">
                  Typ umowy
                </FieldLabel>
                <div className="flex h-10 w-full items-center rounded-md bg-zinc-100 px-3 border border-zinc-200 text-sm text-zinc-700 font-medium">
                  UoP
                </div>
              </Field>

              <Field data-invalid={!!errors.leave}>
                <FieldLabel className="text-xs text-zinc-600">
                  Urlop roczny
                </FieldLabel>
                <Controller
                  control={control}
                  name="leave"
                  render={({ field }) => (
                    <div className="flex h-10 w-full items-center rounded-md bg-zinc-100 p-1 border border-zinc-200">
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
                    {errors.leave.message}
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
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-100 bg-white text-zinc-900 border-zinc-200 shadow-lg">
          <DialogHeader>
            <DialogTitle>Potwierdzenie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600 py-2">
            Czy na pewno chcesz dodać tego pracownika do systemu?
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="border-zinc-300 text-zinc-700 bg-transparent hover:bg-zinc-100"
            >
              Nie
            </Button>
            <Button onClick={confirmAddEmployee}>Tak, dodaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
