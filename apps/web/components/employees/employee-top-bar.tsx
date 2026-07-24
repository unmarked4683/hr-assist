"use client";

import { Plus, Search } from "lucide-react";
import { useId } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_SHELL_HEADER_BASE } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";

interface EmployeeTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onAddClick: () => void;
}

export function EmployeeTopBar({
  query,
  onQueryChange,
  onAddClick,
}: EmployeeTopBarProps) {
  const searchInputId = useId();

  const handleAddZoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onAddClick();
  };

  return (
    <div className={cn(APP_SHELL_HEADER_BASE, "gap-0")}>
      <label
        htmlFor={searchInputId}
        className="flex h-full min-w-0 flex-1 cursor-text items-center pl-6"
      >
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchInputId}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Szukaj pracownika..."
            className="h-8 pl-9"
          />
        </div>
      </label>

      <div
        role="button"
        tabIndex={0}
        aria-label="Dodaj pracownika"
        className="flex h-full shrink-0 cursor-pointer items-center pl-4 pr-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={onAddClick}
        onKeyDown={handleAddZoneKeyDown}
      >
        <span
          className={cn(
            buttonVariants({ size: "icon" }),
            "pointer-events-none",
          )}
          aria-hidden="true"
        >
          <Plus className="size-4" />
        </span>
      </div>
    </div>
  );
}
