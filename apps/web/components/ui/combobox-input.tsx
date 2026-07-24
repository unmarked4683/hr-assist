"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ComboboxInputProps {
  value: string;
  suggestions: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ComboboxInput({
  value,
  suggestions,
  onChange,
  placeholder,
  className,
}: ComboboxInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [...suggestions];
    return suggestions.filter((item) => item.toLowerCase().includes(query));
  }, [suggestions, value]);

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 120)}
      />
      {isFocused && filteredSuggestions.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
          {filteredSuggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(item);
                  setIsFocused(false);
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
