import { FileText, Pencil, UserX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmployeeHeaderProps {
  name: string;
  surname: string;
}

export function EmployeeHeader({ name, surname }: EmployeeHeaderProps) {
  const fullNameUpper = `${name} ${surname}`.toUpperCase();

  return (
    <div className="mb-2 flex shrink-0 items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">{fullNameUpper}</h1>

      <Card className="p-1">
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" title="Raport">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Edytuj">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Zwolnij">
            <UserX className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Usuń"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
