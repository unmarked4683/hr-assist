"use client";

import { useEffect } from "react";

function isOpenDialog(element: Element | null): boolean {
  if (!element) return false;

  const dialog = element.closest('[role="dialog"]');
  if (!dialog) return false;

  return !dialog.classList.contains("pointer-events-none");
}

function isButtonLike(element: Element | null): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;

  return (
    element instanceof HTMLButtonElement ||
    element.getAttribute("role") === "button"
  );
}

export function useAppKeyboard() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;

      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement)) return;

      if (isOpenDialog(activeElement)) return;

      if (isButtonLike(activeElement)) {
        activeElement.blur();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
