import { cn } from "@/lib/utils";

interface PulsingRowProps {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PulsingRow({ active, children, className }: PulsingRowProps) {
  return (
    <tr className={cn(active && "pulse-nn", className)}>
      {children}
    </tr>
  );
}
