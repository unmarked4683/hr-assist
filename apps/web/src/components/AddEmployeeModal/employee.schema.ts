import { ContractType, Location } from "@/types";
import { z } from "zod";

const fullHourRegex = /^([01]\d|2[0-3]):00/;

const parseHourToNumber = (timeStr: string): number => {
  return parseInt(timeStr.split(":")[0], 10);
};

export const employeeSchema = z
  .object({
    name: z.string().min(1, "Imię jest wymagane"),
    surname: z.string().min(1, "Nazwisko jest wymagane"),
    pesel: z.string().length(11, "PESEL musi mieć dokładnie 11 cyfr"),
    position: z.string().min(1, "Stanowisko jest wymagane"),
    location: z.enum(Location, { message: "Wybierz lokalizację" }),
    company: z.string().min(1, "Wybierz firmę"),
    workHours: z.number().int().min(1, "Wybierz wymiar etatu").max(10),
    workSchedule: z.object({
      start: z
        .string()
        .min(1, "Wybierz godzinę startu")
        .regex(fullHourRegex, { message: "Wymagana pełna godzina (HH:00)" }),
      end: z
        .string()
        .min(1, "Wyliczana automatycznie")
        .regex(fullHourRegex, { message: "Wymagana pełna godzina (HH:00)" }),
    }),
    employmentDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
    contractType: z.enum(ContractType, { message: "Wybierz typ umowy" }),
    leave: z.union([z.literal(20), z.literal(26)], {
      message: "Wybierz wymiar urlopu rocznego",
    }),
  })
  .refine(
    (data) => {
      const startHour = parseHourToNumber(data.workSchedule.start);
      const endHour = parseHourToNumber(data.workSchedule.end);

      if (startHour < 6 || startHour > 15 || endHour > 16) {
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
        "Godziny pracy muszą mieścić się w przedziale 06:00 - 16:00, a ich różnica musi odpowiadać wymiarowi etatu.",
      path: ["workSchedule", "end"],
    },
  );

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export function getDefaultEmployeeFormValues(
  initialData?: Partial<EmployeeFormValues>,
): EmployeeFormValues {
  return {
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
    leave: 20,
    ...initialData,
  };
}
