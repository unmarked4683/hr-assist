"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseDismissableOptions {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

export function useDismissable({
  isOpen,
  onClose,
  onToggle,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: UseDismissableOptions) {
  const containerRef = useRef<HTMLElement | null>(null);

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (!isOpen || !closeOnOutsideClick) return;
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      onClose();
    },
    [closeOnOutsideClick, isOpen, onClose],
  );

  const handleDocumentKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [handleDocumentClick, handleDocumentKeyDown]);

  const handleTriggerClick = useCallback(() => {
    if (onToggle) {
      onToggle();
      return;
    }
    if (isOpen) {
      onClose();
    }
  }, [isOpen, onClose, onToggle]);

  return {
    containerRef,
    handleTriggerClick,
  };
}
