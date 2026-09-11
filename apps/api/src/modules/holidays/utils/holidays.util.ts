export const getNagerApiUrl = (
  year: number = new Date().getFullYear(),
): string => {
  const currentYear = new Date().getFullYear();
  if (year < 2026 || year > currentYear + 5) {
    throw new Error(`Year ${year} is out of allowed range.`);
  }

  return `https://nagerholidays.com/api/v4/Holidays/pl/${currentYear}`;
};
