import { cn } from "@/lib/utils";

interface MainStageProps {
  children: React.ReactNode;
  className?: string;
}

export function MainStage({ children, className }: MainStageProps) {
  return (
    <main className={cn("flex h-screen min-h-0 min-w-0 flex-1 flex-col", className)}>
      {children}
    </main>
  );
}
