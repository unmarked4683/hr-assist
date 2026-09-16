"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addHours, parse } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ContractType, Location } from "@/types";
import { EmployeeFormValues, employeeSchema } from "./employee.schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ApiService } from "@/services/api.service";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
      annualLeave: 20,
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
    console.log("Dodano pracownika:", pendingData);
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Imię</Label>
                <Input
                  placeholder="Imię"
                  {...register("name")}
                  className={cn(
                    "border-zinc-300",
                    errors.name && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.name && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Nazwisko</Label>
                <Input
                  placeholder="Nazwisko"
                  {...register("surname")}
                  className={cn(
                    "border-zinc-300",
                    errors.surname &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.surname && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.surname.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">PESEL</Label>
                <Input
                  placeholder="PESEL"
                  {...register("pesel")}
                  className={cn(
                    "border-zinc-300",
                    errors.pesel && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.pesel && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.pesel.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Stanowisko</Label>
                <Input
                  placeholder="Stanowisko"
                  {...register("position")}
                  className={cn(
                    "border-zinc-300",
                    errors.position &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.position && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.position.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Lokalizacja</Label>
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
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.location.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Firma</Label>
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
                          className={cn(
                            "border-zinc-300 text-zinc-900 w-full overflow-hidden",
                            errors.company && "border-red-500",
                          )}
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
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.company.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Wymiar etatu</Label>
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
                        <SelectItem value="8">Pełen etat / 1/1 (8h)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.workHours && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.workHours.message}
                  </span>
                )}
              </div>

              {/* Godzina startu jako Select z filtrowaniem */}
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">
                  Godzina startu (6:00 - 15:00)
                </Label>
                <Controller
                  control={control}
                  name="workSchedule.start"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "border-zinc-300 text-zinc-900 w-full",
                          errors.workSchedule?.start && "border-red-500",
                        )}
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
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.workSchedule.start.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">
                  Godzina końca (Auto)
                </Label>
                <Input
                  type="text"
                  disabled
                  {...register("workSchedule.end")}
                  className="bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed font-medium"
                />
                {errors.workSchedule?.end && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.workSchedule.end.message}
                  </span>
                )}
              </div>
            </div>

            {/* Rząd 4: Data rozpoczęcia, Typ umowy, Urlop roczny */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">
                  Data rozpoczęcia
                </Label>
                <Controller
                  control={control}
                  name="employmentDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border border-zinc-300 rounded-md h-10 px-3 text-sm text-zinc-900 hover:bg-zinc-50 flex items-center",
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
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.employmentDate.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Typ umowy</Label>
                <div className="flex h-10 w-full items-center rounded-md bg-zinc-100 px-3 border border-zinc-200 text-sm text-zinc-700 font-medium">
                  UoP
                </div>
              </div>

              {/* Urlop roczny jako Segmented Control */}
              <div className="space-y-1.5 relative pb-5">
                <Label className="text-xs text-zinc-600">Urlop roczny</Label>
                <Controller
                  control={control}
                  name="annualLeave"
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
                {errors.annualLeave && (
                  <span className="absolute bottom-1 left-0 text-[11px] text-red-500 font-medium">
                    {errors.annualLeave.message}
                  </span>
                )}
              </div>
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
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Dodaj
              </Button>
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
            <Button
              onClick={confirmAddEmployee}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Tak, dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
