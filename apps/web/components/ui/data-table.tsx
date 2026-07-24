import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {children}
    </table>
  );
}

interface DataTableHeadProps {
  children: React.ReactNode;
}

export function DataTableHead({ children }: DataTableHeadProps) {
  return (
    <thead className="sticky top-0 z-10 bg-card">
      {children}
    </thead>
  );
}

interface DataTableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableHeaderCell({
  children,
  className,
}: DataTableHeaderCellProps) {
  return (
    <th
      className={cn(
        "border-b px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide",
        className,
      )}
    >
      {children}
    </th>
  );
}

interface DataTableBodyProps {
  children: React.ReactNode;
}

export function DataTableBody({ children }: DataTableBodyProps) {
  return <tbody>{children}</tbody>;
}

interface DataTableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DataTableRow({ children, onClick, className }: DataTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b transition-colors odd:bg-muted/30",
        onClick && "cursor-pointer hover:bg-muted/60",
        className,
      )}
    >
      {children}
    </tr>
  );
}

interface DataTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableCell({ children, className }: DataTableCellProps) {
  return (
    <td className={cn("px-4 py-3 text-center align-middle", className)}>
      {children}
    </td>
  );
}
