"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEmployeeDto } from "@/types";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { AddEmployeeForm } from "./AddEmployeeForm/AddEmployeeForm";
import { AddEmployeeFormHandle } from "./AddEmployeeForm/AddEmployeeForm.types";
import { EmployeeFormValues } from "./employee.schema";
import { ApiService } from "@/services/api.service";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const queryClient = useQueryClient();
  const formRef = useRef<AddEmployeeFormHandle>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [pendingData, setPendingData] = useState<EmployeeFormValues | null>(
    null,
  );

  const employeeMutation = useMutation({
    mutationFn: async (addEmployeeDto: AddEmployeeDto) => {
      // Mock — docelowo: POST /api/employees
      console.log("ADD_EMPLOYEE_DTO:", addEmployeeDto);
      const response = await ApiService.addEmployee(addEmployeeDto);
      console.log("EMPLOYEE_FROM_API:", response);
      return response;
    },
    onSuccess: () => {
      toast.success("Pracownik dodany pomyślnie");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Błąd podczas dodawania pracownika");
    },
  });

  const handleFormSubmit = (data: EmployeeFormValues) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const confirmAddEmployee = () => {
    if (!pendingData) return;
    employeeMutation.mutate(pendingData as unknown as AddEmployeeDto);
    setIsConfirmOpen(false);
    onClose();
    formRef.current?.reset();
  };

  const handleModalClose = () => {
    formRef.current?.reset();
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
            ref={formRef}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
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
