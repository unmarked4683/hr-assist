"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="flex items-center gap-3 border-b px-6 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Szukaj pracownika..."
          className="h-10 pl-9"
        />
      </div>
      <Button
        type="button"
        size="icon"
        className="size-10 shrink-0"
        aria-label="Dodaj pracownika"
        onClick={onAddClick}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
