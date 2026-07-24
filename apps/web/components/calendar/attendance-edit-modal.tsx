"use client";

import { useState } from "react";

import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_OPTIONS } from "@/lib/constants/attendance";
import type { AttendanceCode, CalendarDay } from "@/lib/types/attendance";
import { formatCalendarHeader, parseIsoDate } from "@/lib/utils/date";

interface AttendanceEditModalProps {
  day: CalendarDay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (date: string, code: AttendanceCode) => Promise<void>;
  onDelete: (date: string) => Promise<void>;
}

export function AttendanceEditModal({
  day,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: AttendanceEditModalProps) {
  const [selectedCode, setSelectedCode] = useState<AttendanceCode>("OB");
  const [isPending, setIsPending] = useState(false);

  const title = day
    ? formatCalendarHeader(parseIsoDate(day.date))
    : "Edycja frekwencji";

  const handleOpen = (nextOpen: boolean) => {
    if (isPending) return;
    if (nextOpen && day) {
      setSelectedCode(day.attendanceCode === "OB" ? "CH" : day.attendanceCode);
    }
    onOpenChange(nextOpen);
  };

  const handleUpdate = async () => {
    if (!day) return;
    setIsPending(true);
    try {
      await onUpdate(day.date, selectedCode);
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!day) return;
    setIsPending(true);
    try {
      await onDelete(day.date);
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpen}
      title={title}
      isPending={isPending}
    >
      <div className="grid grid-cols-3 gap-3">
        <Select
          value={selectedCode}
          onValueChange={(value) => setSelectedCode(value as AttendanceCode)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ATTENDANCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={() => void handleDelete()}
          disabled={isPending}
        >
          Usuń frekwencję
        </Button>

        <Button
          type="button"
          onClick={() => void handleUpdate()}
          disabled={isPending}
        >
          Aktualizuj
        </Button>
      </div>
    </Modal>
  );
}
