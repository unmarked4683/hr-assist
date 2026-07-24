import { formatBirthDate } from "@/lib/utils/date";

const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const;

function getCenturyFromMonthCode(monthCode: number, yearPart: number): number {
  if (monthCode >= 1 && monthCode <= 12) return 1900;
  if (monthCode >= 21 && monthCode <= 32) return 2000;
  if (monthCode >= 41 && monthCode <= 52) return 2100;
  if (monthCode >= 61 && monthCode <= 72) return 2200;
  if (monthCode >= 81 && monthCode <= 92) return 1800;
  return 1900 + yearPart;
}

function normalizeMonth(monthCode: number): number {
  return ((monthCode - 1) % 20) + 1;
}

export function extractBirthDateFromPesel(pesel: string): Date | null {
  if (!/^\d{11}$/.test(pesel)) return null;

  const yearPart = Number(pesel.slice(0, 2));
  const monthCode = Number(pesel.slice(2, 4));
  const day = Number(pesel.slice(4, 6));
  const century = getCenturyFromMonthCode(monthCode, yearPart);
  const year = century + yearPart;
  const month = normalizeMonth(monthCode);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function validatePeselChecksum(pesel: string): boolean {
  if (!/^\d{11}$/.test(pesel)) return false;

  const sum = PESEL_WEIGHTS.reduce(
    (acc, weight, index) => acc + weight * Number(pesel[index]),
    0,
  );
  const checksum = (10 - (sum % 10)) % 10;
  return checksum === Number(pesel[10]);
}

export function validatePesel(pesel: string): boolean {
  return validatePeselChecksum(pesel) && extractBirthDateFromPesel(pesel) !== null;
}

export function formatPeselBirthDateHelper(pesel: string): string | null {
  const birthDate = extractBirthDateFromPesel(pesel);
  if (!birthDate || !validatePeselChecksum(pesel)) return null;
  return formatBirthDate(birthDate);
}
