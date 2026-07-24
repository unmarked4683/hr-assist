"use client";

import { Archive, FileText, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { STUB_ACTION_MESSAGE } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type IconAction = "edit" | "report" | "archive" | "delete";

const ACTION_CONFIG: Record<
  IconAction,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  edit: { label: "Edytuj", icon: Pencil },
  report: { label: "Raport", icon: FileText },
  archive: { label: "Zwolnij/Archiwizuj", icon: Archive },
  delete: { label: "Usuń", icon: Trash2 },
};

interface IconActionBarProps {
  onAction?: (action: IconAction) => void;
  className?: string;
}

export function IconActionBar({ onAction, className }: IconActionBarProps) {
  const handleClick = (action: IconAction) => {
    if (onAction) {
      onAction(action);
      return;
    }
    window.alert(STUB_ACTION_MESSAGE);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {(Object.keys(ACTION_CONFIG) as IconAction[]).map((action) => {
        const { label, icon: Icon } = ACTION_CONFIG[action];
        return (
          <Button
            key={action}
            type="button"
            variant="outline"
            size="icon"
            aria-label={label}
            onClick={() => handleClick(action)}
          >
            <Icon className="size-4" />
          </Button>
        );
      })}
    </div>
  );
}
