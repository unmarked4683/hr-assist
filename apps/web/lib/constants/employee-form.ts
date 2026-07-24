import type { ContractType, FteFraction, Location } from "@/lib/types/employee";

export const CONTRACT_TYPE: ContractType = "UoP";

export const FTE_FRACTIONS: FteFraction[] = [
  "1/8",
  "2/8",
  "3/8",
  "4/8",
  "5/8",
  "6/8",
  "7/8",
  "8/8",
];

export const FTE_HOURS_MAP: Record<FteFraction, number> = {
  "1/8": 1,
  "2/8": 2,
  "3/8": 3,
  "4/8": 4,
  "5/8": 5,
  "6/8": 6,
  "7/8": 7,
  "8/8": 8,
};

export const WORK_TIME_MIN = "04:00";
export const WORK_TIME_MAX = "22:00";

export const LEAVE_DAYS_MIN = 0;
export const LEAVE_DAYS_MAX = 26;

export const LOCATION_OPTIONS: Location[] = ["Biuro", "Hala"];

export const ANNUAL_POOL_OPTIONS = [20, 26] as const;

export const POSITION_SUGGESTIONS = [
  "Magazynier",
  "Konstruktor",
  "Specjalista HR",
  "Księgowa",
  "Operator maszyn",
] as const;

export const LEGAL_ENTITIES = [
  { id: "le-1", name: "Dział Konstrukcji" },
  { id: "le-2", name: "Dział Produkcji" },
  { id: "le-3", name: "Dział Administracji" },
] as const;
