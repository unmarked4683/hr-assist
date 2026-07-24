"use client";

import { EmployeeDataTab } from "@/components/employees/employee-data-tab";
import { EmployeeProfileHeader } from "@/components/employees/employee-profile-header";
import { LeaveTab } from "@/components/employees/leave-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Employee } from "@/lib/types/employee";

const profileContentPanelClass = "h-[7rem] w-full";

interface EmployeeProfileSectionProps {
  employee: Employee;
}

export function EmployeeProfileSection({ employee }: EmployeeProfileSectionProps) {
  return (
    <div className="shrink-0">
      <Tabs defaultValue="data" className="gap-6">
        <EmployeeProfileHeader employee={employee} />

        <TabsList>
          <TabsTrigger value="data">Dane pracownika</TabsTrigger>
          <TabsTrigger value="leave">Urlopy</TabsTrigger>
        </TabsList>

        <div className={profileContentPanelClass}>
          <TabsContent value="data" className="mt-0 h-full">
            <EmployeeDataTab employee={employee} />
          </TabsContent>
          <TabsContent value="leave" className="mt-0 h-full">
            <LeaveTab employee={employee} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
