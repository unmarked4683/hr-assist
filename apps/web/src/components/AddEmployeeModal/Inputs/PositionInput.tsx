import { useQuery } from "@tanstack/react-query";
import ms from "ms";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ApiService } from "@/services/api.service";

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
  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => await ApiService.getPositions(),
    staleTime: ms("5 minutes"),
  });

  return (
    <Combobox
      items={positions}
      value={value || null}
      onValueChange={(val) => {
        onChange(val ?? "");
      }}
    >
      <ComboboxInput
        placeholder="Wpisz lub wybierz stanowisko..."
        aria-invalid={isInvalid}
        className="border-zinc-300 text-zinc-900 bg-white data-[invalid=true]:border-red-500"
      />
      <ComboboxContent className="bg-white border-zinc-200 text-zinc-900 shadow-md">
        <ComboboxEmpty>
          {isLoading
            ? "Ładowanie..."
            : "Brak wyników (wpisany tekst zostanie użyty)."}
        </ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
