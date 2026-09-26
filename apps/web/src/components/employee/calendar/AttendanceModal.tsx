"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AttendanceStatus, STATUS_PRESENTATION } from "./types";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  currentStatus: AttendanceStatus | null;
  onUpdate: (status: AttendanceStatus) => Promise<void>;
}

const STATUS_OPTIONS = Object.values(AttendanceStatus);

export function AttendanceModal({
  isOpen,
  onClose,
  date,
  currentStatus,
  onUpdate,
}: AttendanceModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>(
    currentStatus ?? AttendanceStatus.OB,
  );
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = format(date, "d MMMM yyyy", { locale: pl });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(selectedStatus);
    } catch {
      // Błąd jest już logowany przez mutację wywołującą onUpdate —
      // zostawiamy modal otwarty, żeby użytkownik mógł spróbować ponownie.
      setIsSaving(false);
      return;
    }

    // Odświeżenie cache (kalendarz, urlopy, pracownik) robi mutacja w CalendarRow.
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white text-zinc-900 border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-wide text-center">
            Zmiana frekwencji
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <p className="text-sm font-medium text-muted-foreground">
            {formattedDate}
          </p>

          <div className="w-full space-y-2 text-left">
            <label className="text-xs font-medium text-muted-foreground">
              Status obecności
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as AttendanceStatus)
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((statusOption) => {
                const presentation = STATUS_PRESENTATION[statusOption];

                return (
                  <option key={statusOption} value={statusOption}>
                    {presentation.label} ({presentation.code})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="w-full pt-2">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? "Zapisywanie…" : "Zaktualizuj"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
