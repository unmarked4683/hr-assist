import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ApiService } from "@/services/api.service";
import { cn } from "@/lib/utils";

interface PositionInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

export function PositionInput({
  value,
  onChange,
  isInvalid,
}: PositionInputProps) {
  const [open, setOpen] = useState(false);

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => await ApiService.getPositions(),
    staleTime: ms("5 minutes"),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Dodane asChild, żeby PopoverTrigger poprawnie obsłużył niestandardowy div */}
      <PopoverTrigger>
        <div
          aria-invalid={isInvalid}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md bg-white border border-zinc-300 px-3 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 cursor-pointer data-[invalid=true]:border-red-500",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {value || "Wpisz lub wybierz stanowisko..."}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 bg-white border-zinc-200 text-zinc-900 shadow-md"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Szukaj stanowiska..." />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Ładowanie stanowisk..."
                : "Brak wyników. Możesz wpisać własne."}
            </CommandEmpty>
            <CommandGroup>
              {positions.map((position) => (
                <CommandItem
                  key={position}
                  value={position}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === position ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {position}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
