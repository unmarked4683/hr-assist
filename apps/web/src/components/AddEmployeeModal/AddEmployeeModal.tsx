"use client";

import { useForm } from "react-hook-form";
import { ContractType, Location } from "@/types";
import { EmployeeFormValues, employeeSchema } from "./employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export function AddEmployeeModal() {
  const { register, handleSubmit } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      surname: "",
      pesel: "",
      position: "",
      location: Location.OFFICE,
      company: "",
      workHours: 8,
      workSchedule: {
        start: "08:00",
        end: "16:00",
      },
      employmentDate: new Date().toISOString().split("T")[0],
      contractType: ContractType.EMPLOYMENT_CONTRACT,
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    console.log("Zweryfikowane dane z formularza:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Imię" {...register("name")} />
      <Input placeholder="Nazwisko" {...register("surname")} />
      <Input placeholder="PESEL" {...register("pesel")} />
      <Input placeholder="Stanowisko" {...register("position")} />
      <Input placeholder="Lokalizacja" {...register("location")} />
      <Input placeholder="Firma" {...register("company")} />
      <Input placeholder="Godziny pracy" {...register("workHours")} />
    </form>
  );
}
