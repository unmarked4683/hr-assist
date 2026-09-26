import { cn } from "@/lib/utils";

interface TodayMarkerProps {
  className?: string;
}

export function TodayMarker({ className }: TodayMarkerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-y-0 left-0 z-[1] flex w-1 items-center justify-center overflow-hidden rounded-r-sm bg-red-600 transition-all duration-200 ease-out group-hover:w-10",
        className,
      )}
    >
      <span className="w-full text-center text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase opacity-0 transition-opacity duration-150 delay-75 group-hover:opacity-100">
        Dziś
      </span>
    </span>
  );
}
