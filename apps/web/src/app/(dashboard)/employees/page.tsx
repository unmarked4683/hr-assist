"use client";

import List from "@/components/Employees/List";
import { Search } from "@/components/Employees/Search";

export default function EmployeesPage() {
  const handleAddEmployee = () => {
    console.log("dodawanie pracownika");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Search onAddClick={handleAddEmployee} />
      <List />
    </div>
  );
}
