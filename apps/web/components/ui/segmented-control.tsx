"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  getLabel?: (value: T) => string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  getLabel = (option) => option,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn("grid gap-1 rounded-md border bg-muted/40 p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      role="tablist"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-sm px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border border-border bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {getLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
