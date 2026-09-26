import { parseISO } from "date-fns";

/**
 * Data startu aplikacji (ISO, YYYY-MM-DD) — najwcześniejszy dzień, dla którego
 * system prowadzi ewidencję. Kalendarz i formularze nie pozwalają zejść niżej.
 */
export const APP_START_DATE_ISO = "2026-01-01";

/** `APP_START_DATE_ISO` sparsowane w strefie lokalnej (parseISO dla samej daty nie przesuwa o UTC). */
export const APP_START_DATE: Date = parseISO(APP_START_DATE_ISO);

/**
 * Ile lat w przód można przeglądać/planować kalendarz (zgodnie z walidacją
 * backendu: rok bieżący + 5). Limit obejmuje cały ostatni rok — do grudnia.
 */
export const APP_MAX_YEARS_AHEAD = 5;
