import { CalendarRecord } from "./types";

const MOCK_DELAY_MS = 300;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function buildDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export async function getMockAttendance(
  year: number,
  month: number,
): Promise<CalendarRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records: CalendarRecord[] = [
        { date: buildDateKey(year, month, 2), status: "VACATION" },
        { date: buildDateKey(year, month, 3), status: "REQUEST_VACATION" },
        { date: buildDateKey(year, month, 4), status: "SICK_LEAVE" },
        { date: buildDateKey(year, month, 8), status: "CARE_LEAVE" },
        { date: buildDateKey(year, month, 9), status: "UNEXCUSED_ABSENCE" },
      ];

      resolve(records);
    }, MOCK_DELAY_MS);
  });
}
