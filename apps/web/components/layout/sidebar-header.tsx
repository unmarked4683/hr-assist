import { APP_NAME } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  className?: string;
}

export function SidebarHeader({ className }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-16 w-full shrink-0 items-center border-b bg-status-ok px-4",
        className,
      )}
    >
      <div className="flex w-full items-center justify-center text-base font-semibold text-white">
        {APP_NAME}
      </div>
    </div>
  );
}
