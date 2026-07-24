import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
