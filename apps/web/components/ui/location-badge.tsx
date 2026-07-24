import { Building2, Warehouse } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Location } from "@/lib/types/employee";

interface LocationBadgeProps {
  location: Location;
  className?: string;
}

export function LocationBadge({ location, className }: LocationBadgeProps) {
  const Icon = location === "Biuro" ? Building2 : Warehouse;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-muted px-2 py-1 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {location}
    </span>
  );
}
