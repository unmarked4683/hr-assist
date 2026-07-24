"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STUB_ACTION_MESSAGE } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SecondaryAction = "report" | "archive" | "delete";

interface EmployeeHybridActionsProps {
  onEdit?: () => void;
  onAction?: (action: SecondaryAction) => void;
  className?: string;
}

export function EmployeeHybridActions({
  onEdit,
  onAction,
  className,
}: EmployeeHybridActionsProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      return;
    }
    window.alert(STUB_ACTION_MESSAGE);
  };

  const handleAction = (action: SecondaryAction) => {
    if (onAction) {
      onAction(action);
      return;
    }
    window.alert(STUB_ACTION_MESSAGE);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button type="button" variant="outline" onClick={handleEdit}>
        Edytuj
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Więcej akcji"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("report")}>
            Raport
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("archive")}>
            Zwolnij
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
            onClick={() => handleAction("delete")}
          >
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
