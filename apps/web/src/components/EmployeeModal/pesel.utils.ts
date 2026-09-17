const MONTH_CENTURY_OFFSETS: Array<{ base: number; offset: number }> = [
  { base: 1800, offset: 80 },
  { base: 1900, offset: 0 },
  { base: 2000, offset: 20 },
  { base: 2100, offset: 40 },
  { base: 2200, offset: 60 },
];

export function getBirthDateFromPesel(pesel: string): Date | null {
  if (!/^\d{11}$/.test(pesel)) return null;

  const year = parseInt(pesel.slice(0, 2), 10);
  const monthRaw = parseInt(pesel.slice(2, 4), 10);
  const day = parseInt(pesel.slice(4, 6), 10);

  const century = MONTH_CENTURY_OFFSETS.find(
    ({ offset }) => monthRaw > offset && monthRaw <= offset + 12,
  );
  if (!century) return null;

  const month = monthRaw - century.offset;
  const fullYear = century.base + year;
  const date = new Date(fullYear, month - 1, day);

  const isValid =
    date.getFullYear() === fullYear &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
}
