"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CONFIRM_CONTINUE_MESSAGE } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export interface ConfirmConfig {
  title: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
}

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
  };
  isSubmitDisabled?: boolean;
  isPending?: boolean;
  confirmConfig?: ConfirmConfig;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  primaryAction,
  isSubmitDisabled = false,
  isPending = false,
  confirmConfig,
  className,
}: ModalProps) {
  const titleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClose = useCallback(() => {
    if (isPending) return;
    setConfirmOpen(false);
    onOpenChange(false);
  }, [isPending, onOpenChange]);

  useEffect(() => {
    if (!open || confirmOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      handleClose();
    };

    document.addEventListener("keydown", handleEscape, true);
    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [confirmOpen, handleClose, open]);

  const runPrimaryAction = async () => {
    if (!primaryAction || primaryAction.disabled || isSubmitDisabled || isPending) {
      return;
    }

    if (confirmConfig) {
      setConfirmOpen(true);
      return;
    }

    await primaryAction.onClick();
  };

  const handleConfirm = async () => {
    if (!confirmConfig) return;
    await confirmConfig.onConfirm();
    setConfirmOpen(false);
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          !open && "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          className={cn(
            "relative w-full max-w-3xl rounded-lg border bg-card shadow-xl",
            className,
          )}
        >
          <div className="relative border-b px-6 py-4">
            <h2
              id={titleId}
              className="text-center text-lg font-semibold"
            >
              {title}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-2"
              onClick={handleClose}
              disabled={isPending}
              aria-label="Zamknij"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="px-6 py-4">{children}</div>

          {footer ?? primaryAction ? (
            <div className="border-t px-6 py-4">
              {footer ?? (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => void runPrimaryAction()}
                    disabled={
                      isPending ||
                      isSubmitDisabled ||
                      primaryAction?.disabled
                    }
                  >
                    {isPending ? "Zapisywanie..." : primaryAction?.label}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{confirmConfig?.title ?? "Potwierdzenie"}</DialogTitle>
            <DialogDescription>
              {confirmConfig?.message ?? CONFIRM_CONTINUE_MESSAGE}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="button" onClick={() => void handleConfirm()}>
              Kontynuuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
