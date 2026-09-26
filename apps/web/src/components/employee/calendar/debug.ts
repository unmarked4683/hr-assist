const IS_ENABLED = process.env.NODE_ENV !== "production";

/** Logi diagnostyczne kalendarza — wyłączone w buildzie produkcyjnym. */
export const calendarLog = (
  event: string,
  payload?: Record<string, unknown>,
): void => {
  if (!IS_ENABLED) return;
  console.log(`[EmployeeCalendar] ${event}`, payload ?? "");
};
