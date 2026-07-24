import { cn } from "@/lib/utils";

interface StickyTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyTableContainer({
  children,
  className,
}: StickyTableContainerProps) {
  return (
    <div className={cn("scroll-pane rounded-md border bg-card", className)}>
      {children}
    </div>
  );
}
