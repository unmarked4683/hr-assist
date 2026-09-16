"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addHours, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CompanyOption {
  id: string;
  name: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<EmployeeFormValues | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;

    async function fetchCompanies() {
      setIsLoadingCompanies(true);
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Błąd pobierania firm:", err);
      } finally {
        setIsLoadingCompanies(false);
      }
    }

    fetchCompanies();
  }, [isOpen]);

  const { register, handleSubmit, control, watch, setValue, reset } =
    useForm<EmployeeFormValues>({
      resolver: zodResolver(employeeSchema),
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
      },
    });

  const watchStart = watch("workSchedule.start");
  const watchWorkHours = watch("workHours");

  useEffect(() => {
    if (watchStart && watchWorkHours) {
      try {
        const parsedDate = parse(watchStart, "HH:mm", new Date());
        const endDate = addHours(parsedDate, Number(watchWorkHours));
        setValue("workSchedule.end", format(endDate, "HH:mm"));
      } catch {
        // Ignoruj błędy parsowania
      }
    }
  }, [watchStart, watchWorkHours, setValue]);

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
        <DialogContent className="sm:max-w-175 bg-zinc-950 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-wide">
              Dodawanie pracownika
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Imię</Label>
                <Input
                  placeholder="Imię"
                  {...register("name")}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nazwisko</Label>
                <Input
                  placeholder="Nazwisko"
                  {...register("surname")}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">PESEL</Label>
                <Input
                  placeholder="PESEL"
                  {...register("pesel")}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Stanowisko</Label>
                <Input
                  placeholder="Stanowisko"
                  {...register("position")}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Lokalizacja</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 bg-zinc-900 h-10 p-1 border border-zinc-800">
                        <TabsTrigger
                          value={Location.OFFICE}
                          className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                        >
                          Biuro
                        </TabsTrigger>
                        <TabsTrigger
                          value={"HALL" as unknown as Location}
                          className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                        >
                          Hala
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Firma</Label>
                <Controller
                  control={control}
                  name="company"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectValue
                          placeholder={
                            isLoadingCompanies
                              ? "Ładowanie..."
                              : "Wybierz firmę..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        {companies.map((comp) => (
                          <SelectItem key={comp.id} value={comp.id}>
                            {comp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Wymiar etatu</Label>
                <Controller
                  control={control}
                  name="workHours"
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectValue placeholder="Wybierz..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="4">4 godziny</SelectItem>
                        <SelectItem value="7">7 godzin</SelectItem>
                        <SelectItem value="8">8 godzin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Godzina startu</Label>
                <Input
                  type="time"
                  {...register("workSchedule.start")}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 block w-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">
                  Godzina końca (Auto)
                </Label>
                <Input
                  type="time"
                  disabled
                  {...register("workSchedule.end")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">
                  Data rozpoczęcia
                </Label>
                <Controller
                  control={control}
                  name="employmentDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-900 border border-zinc-800 rounded-md h-10 px-3 text-sm text-zinc-100 hover:bg-zinc-800 flex items-center",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? field.value : <span>Wybierz datę</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 text-zinc-100">
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
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Typ umowy</Label>
                <Select
                  disabled
                  defaultValue={ContractType.EMPLOYMENT_CONTRACT}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-500 cursor-not-allowed">
                    <SelectValue placeholder="UoP" />
                  </SelectTrigger>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Urlop roczny</Label>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-md p-1 h-10 items-center justify-around text-xs font-medium text-zinc-300">
                  <span>20 dni</span>
                  <span className="text-zinc-600">|</span>
                  <span>26 dni</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
        <DialogContent className="sm:max-w-100 bg-zinc-950 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Potwierdzenie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400 py-2">
            Czy na pewno chcesz dodać tego pracownika do systemu?
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800"
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
