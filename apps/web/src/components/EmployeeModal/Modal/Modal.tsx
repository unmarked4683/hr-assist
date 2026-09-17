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
import { ApiService } from "@/services/api.service";
import { AddEmployeeDto } from "@/types";
import { ConfirmModal } from "../../ConfirmModal/ConfirmModal";
import { Form } from "../Form/Form";
import { FormHandle } from "../Form/Form.types";
import {
  EmployeeFormValues,
  LAST_EMPLOYEE_DEFAULTS_QUERY_KEY,
  pickRememberedFields,
} from "../employee.schema";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeModal({ isOpen, onClose }: EmployeeModalProps) {
  const queryClient = useQueryClient();
  const formRef = useRef<FormHandle>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [pendingData, setPendingData] = useState<EmployeeFormValues | null>(
    null,
  );

  const employeeMutation = useMutation({
    mutationFn: async (addEmployeeDto: AddEmployeeDto) => {
      //! API: POST /api/employees
      return await ApiService.addEmployee(addEmployeeDto);
    },
    onSuccess: () => {
      toast.success("Pracownik dodany pomyślnie");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Nowe, niestandardowe stanowisko mogło zostać dodane po stronie backendu.
      queryClient.invalidateQueries({ queryKey: ["positions"] });
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
    queryClient.setQueryData(
      LAST_EMPLOYEE_DEFAULTS_QUERY_KEY,
      pickRememberedFields(pendingData),
    );
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

          <Form ref={formRef} onSubmit={handleFormSubmit} onCancel={handleModalClose} />
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
