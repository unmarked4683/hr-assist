import { cn } from "@/lib/utils";

interface TodayMarkerProps {
  className?: string;
}

export function TodayMarker({ className }: TodayMarkerProps) {
  return (
    <span
      className={cn(
        "ml-2 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase",
        className,
      )}
    >
      Dziś
    </span>
  );
}
