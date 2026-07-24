"use client";

import { useAppKeyboard } from "@/lib/hooks/use-app-keyboard";

export function AppKeyboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAppKeyboard();
  return children;
}
