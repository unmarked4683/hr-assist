import { ContractType, Location } from "@/types";
import { z } from "zod";

const fullHourRegex = /^([01]\d|2[0-3]):00/;

const parseHourToNumber = (timeStr: string): number => {
  return parseInt(timeStr.split(":")[0], 10);
};

export const employeeSchema = z
  .object({
    name: z.string().min(1),
    surname: z.string().min(1),
    pesel: z.string().length(11, "PESEL musi mieć 11 cyfr"),
    position: z.string().min(1),
    location: z.enum(Location),
    company: z.uuidv4(),
    workHours: z.number().int().min(1).max(10),
    workSchedule: z.object({
      start: z
        .string()
        .regex(fullHourRegex, { message: "Wymagana pełna godzina (HH:00)" }),
      end: z
        .string()
        .regex(fullHourRegex, { message: "Wymagana pełna godzina (HH:00)" }),
    }),
    employmentDate: z.string().min(1),
    contractType: z.enum(ContractType),
  })
  .refine(
    (data) => {
      const startHour = parseHourToNumber(data.workSchedule.start);
      const endHour = parseHourToNumber(data.workSchedule.end);

      if (startHour < 6 || endHour > 16) {
        return false;
      }

      if (endHour <= startHour) {
        return false;
      }

      const difference = endHour - startHour;
      if (difference !== data.workHours) {
        return false;
      }

      return true;
    },
    {
      message:
        "Godziny pracy muszą mieścić się w przedziale 06:00 - 16:00, a ich różnica musi dokładnie odpowiadać liczbie godzin pracy (workHours).",
      path: ["workSchedule", "end"],
    },
  );

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
