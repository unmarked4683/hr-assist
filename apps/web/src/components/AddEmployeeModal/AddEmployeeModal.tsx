"use client";

import { ApiService } from "@/services/api.service";
import { AddEmployeeDto, ContractType, Location } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addHours, format, parse } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployeeFormValues, employeeSchema } from "./employee.schema";
import { useForm } from "react-hook-form";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { AddEmployeeForm } from "./AddEmployeeForm/AddEmployeeForm";

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

          <AddEmployeeForm
            register={register}
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            handleFormSubmit={handleFormSubmit}
            handleModalClose={handleModalClose}
            companies={companies}
            isLoadingCompanies={isLoadingCompanies}
            availableStartHours={availableStartHours}
          />
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isConfirmOpen={isConfirmOpen}
        setIsConfirmOpen={setIsConfirmOpen}
        confirmAddEmployee={confirmAddEmployee}
      />
    </>
  );
}
