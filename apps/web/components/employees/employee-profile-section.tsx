"use client";

import { EmployeeDataTab } from "@/components/employees/employee-data-tab";
import { EmployeeProfileHeader } from "@/components/employees/employee-profile-header";
import { LeaveTab } from "@/components/employees/leave-tab";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Employee } from "@/lib/types/employee";

const profileTabsListClass =
  "flex min-h-11 w-full items-stretch gap-0 rounded-none border-b border-slate-200 bg-transparent p-0";

const profileTabTriggerClass =
  "h-full min-h-11 flex-1 rounded-none px-3 py-3 text-sm font-semibold leading-snug";

const profileContentPanelClass = "h-32 overflow-hidden";

interface EmployeeProfileSectionProps {
  employee: Employee;
}

export function EmployeeProfileSection({ employee }: EmployeeProfileSectionProps) {
  return (
    <div className="shrink-0 space-y-4">
      <EmployeeProfileHeader employee={employee} />

      <Tabs defaultValue="data" className="gap-0">
        <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-sm">
          <TabsList variant="line" className={profileTabsListClass}>
            <TabsTrigger value="data" className={profileTabTriggerClass}>
              Dane pracownika
            </TabsTrigger>
            <TabsTrigger value="leave" className={profileTabTriggerClass}>
              Urlopy
            </TabsTrigger>
          </TabsList>

          <div className={profileContentPanelClass}>
            <TabsContent value="data" className="mt-0 overflow-hidden p-0">
              <EmployeeDataTab employee={employee} />
            </TabsContent>
            <TabsContent value="leave" className="mt-0 h-full overflow-hidden p-4">
              <LeaveTab employee={employee} />
            </TabsContent>
          </div>
        </Card>
      </Tabs>
    </div>
  );
}
