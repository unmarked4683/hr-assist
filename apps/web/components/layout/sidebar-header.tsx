import { APP_NAME } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  className?: string;
}

export function SidebarHeader({ className }: SidebarHeaderProps) {
  return (
    <div className={cn("flex w-full border-b bg-status-ok px-4 py-4", className)}>
      <div className="flex h-10 w-full items-center justify-center text-base font-semibold text-white">
        {APP_NAME}
      </div>
    </div>
  );
}
