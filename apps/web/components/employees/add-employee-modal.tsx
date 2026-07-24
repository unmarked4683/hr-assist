"use client";

import {
  CONTRACT_TYPE,
  FTE_FRACTIONS,
  LEGAL_ENTITIES,
  LEAVE_DAYS_MAX,
  LEAVE_DAYS_MIN,
  LOCATION_OPTIONS,
  POSITION_SUGGESTIONS,
} from "@/lib/constants/employee-form";
import { FormField } from "@/components/employees/form-field";
import { Modal } from "@/components/modals/modal";
import { ComboboxInput } from "@/components/ui/combobox-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { CreateEmployeeInput, FteFraction, Location } from "@/lib/types/employee";
import { formatPeselBirthDateHelper, validatePesel } from "@/lib/utils/pesel";
import {
  computeEndTime,
  formatFteLabel,
  validateWorkingHours,
} from "@/lib/utils/working-hours";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateEmployeeInput) => Promise<void>;
}

export function AddEmployeeModal({
  open,
  onOpenChange,
  onSubmit,
}: AddEmployeeModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pesel, setPesel] = useState("");
  const [fte, setFte] = useState<FteFraction>("8/8");
  const [workStart, setWorkStart] = useState("08:00");
  const [workEnd, setWorkEnd] = useState("16:00");
  const [location, setLocation] = useState<Location>("Biuro");
  const [position, setPosition] = useState("");
  const [legalEntityId, setLegalEntityId] = useState<string>(LEGAL_ENTITIES[0].id);
  const [overdueLeaveUsed, setOverdueLeaveUsed] = useState("0");
  const [annualLeavePool, setAnnualLeavePool] = useState<20 | 26>(26);
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPesel("");
    setFte("8/8");
    setWorkStart("08:00");
    setWorkEnd("16:00");
    setLocation("Biuro");
    setPosition("");
    setLegalEntityId(LEGAL_ENTITIES[0].id);
    setOverdueLeaveUsed("0");
    setAnnualLeavePool(26);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleFteChange = (value: FteFraction) => {
    setFte(value);
    setWorkEnd(computeEndTime(workStart, value));
  };

  const handleWorkStartChange = (value: string) => {
    setWorkStart(value);
    setWorkEnd(computeEndTime(value, fte));
  };

  const peselHelper = formatPeselBirthDateHelper(pesel);
  const hoursValidation = validateWorkingHours(workStart, workEnd);
  const overdueValue = Number(overdueLeaveUsed);

  const isValid = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      validatePesel(pesel) &&
      position.trim().length > 0 &&
      hoursValidation.valid &&
      overdueValue >= LEAVE_DAYS_MIN &&
      overdueValue <= LEAVE_DAYS_MAX
    );
  }, [
    firstName,
    hoursValidation.valid,
    lastName,
    overdueValue,
    pesel,
    position,
  ]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsPending(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        pesel,
        contractType: CONTRACT_TYPE,
        fte,
        workStart,
        workEnd,
        location,
        position: position.trim(),
        legalEntityId,
        leave: {
          overdueUsed: overdueValue,
          pool: annualLeavePool,
        },
      });
      handleOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Dodaj pracownika"
      isPending={isPending}
      isSubmitDisabled={!isValid}
      primaryAction={{
        label: "Dodaj pracownika",
        onClick: handleSubmit,
      }}
      className="max-w-4xl"
    >
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Imię">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Nazwisko">
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
          <FormField label="PESEL" helper={peselHelper ? `Data urodzenia: ${peselHelper}` : undefined}>
            <Input
              value={pesel}
              maxLength={11}
              onChange={(e) => setPesel(e.target.value.replace(/\D/g, ""))}
              className={cn(pesel.length === 11 && !validatePesel(pesel) && "border-destructive")}
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <FormField label="Typ umowy">
            <Input value={CONTRACT_TYPE} disabled />
          </FormField>
          <FormField label="Wymiar etatu" helper={formatFteLabel(fte)}>
            <Select value={fte} onValueChange={(value) => handleFteChange(value as FteFraction)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FTE_FRACTIONS.map((fraction) => (
                  <SelectItem key={fraction} value={fraction}>
                    {fraction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Godzina rozpoczęcia" error={hoursValidation.errors.workStart}>
            <Input
              value={workStart}
              onChange={(e) => handleWorkStartChange(e.target.value)}
              className={cn(hoursValidation.errors.workStart && "border-destructive")}
            />
          </FormField>
          <FormField label="Godzina zakończenia" error={hoursValidation.errors.workEnd}>
            <Input
              value={workEnd}
              onChange={(e) => setWorkEnd(e.target.value)}
              className={cn(hoursValidation.errors.workEnd && "border-destructive")}
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Lokalizacja">
            <SegmentedControl
              value={location}
              options={LOCATION_OPTIONS}
              onChange={setLocation}
            />
          </FormField>
          <FormField label="Stanowisko">
            <ComboboxInput
              value={position}
              suggestions={POSITION_SUGGESTIONS}
              onChange={setPosition}
              placeholder="Wybierz lub wpisz stanowisko"
            />
          </FormField>
          <FormField label="Firma / Byt prawny">
            <Select
              value={legalEntityId}
              onValueChange={(value) => {
                if (value) setLegalEntityId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEGAL_ENTITIES.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Urlop zaległy">
            <Input
              type="number"
              min={LEAVE_DAYS_MIN}
              max={LEAVE_DAYS_MAX}
              value={overdueLeaveUsed}
              onChange={(e) => setOverdueLeaveUsed(e.target.value)}
            />
          </FormField>
          <FormField label="Pula roczna">
            <SegmentedControl<"20" | "26">
              value={String(annualLeavePool) as "20" | "26"}
              options={["20", "26"]}
              onChange={(value) => setAnnualLeavePool(Number(value) as 20 | 26)}
              getLabel={(value) => `${value} dni`}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
