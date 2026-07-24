import { SidebarHeader } from "@/components/layout/sidebar-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { cn } from "@/lib/utils";

interface AsideProps {
  footer: React.ReactNode;
  className?: string;
}

export function Aside({ footer, className }: AsideProps) {
  return (
    <aside
      className={cn(
        "flex h-screen w-[260px] shrink-0 flex-col border-r bg-muted/20",
        className,
      )}
    >
      <SidebarHeader />
      <div className="flex flex-1 flex-col p-4 pt-6">
        <SidebarNav />
        <div className="mt-auto pt-4">{footer}</div>
      </div>
    </aside>
  );
}
