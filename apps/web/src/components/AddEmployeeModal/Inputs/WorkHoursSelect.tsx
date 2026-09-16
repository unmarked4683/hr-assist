import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WORK_HOURS_OPTIONS = [
  { value: 4, label: "1/2 (4h)" },
  { value: 6, label: "3/4 (6h)" },
  { value: 7, label: "7/8 (7h)" },
  { value: 8, label: "Pełen etat" },
] as const;

interface WorkHoursSelectProps {
  value: number | undefined;
  onChange: (value: number) => void;
  isInvalid?: boolean;
}

export function WorkHoursSelect({
  value,
  onChange,
  isInvalid,
}: WorkHoursSelectProps) {
  const selectedOption = WORK_HOURS_OPTIONS.find((opt) => opt.value === value);

  return (
    <Select
      onValueChange={(val) => onChange(Number(val))}
      value={value?.toString()}
    >
      <SelectTrigger
        aria-invalid={isInvalid}
        className="border-zinc-300 text-zinc-900 w-full data-[invalid=true]:border-red-500"
      >
        <SelectValue placeholder="Wybierz etat...">
          {selectedOption ? selectedOption.label : "Wybierz etat..."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-zinc-200 text-zinc-900">
        {WORK_HOURS_OPTIONS.map((item) => (
          <SelectItem key={item.value} value={item.value.toString()}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
