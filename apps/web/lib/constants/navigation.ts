export const APP_NAME = "HR Assist";

export const ROUTES = {
  login: "/login",
  employees: "/employees",
  employeeDetail: (id: string) => `/employees/${id}`,
  dniWolne: "/dni-wolne",
} as const;

export const NAV_ITEMS = [
  { label: "Pracownicy", href: ROUTES.employees },
  { label: "Dni wolne", href: ROUTES.dniWolne },
] as const;

export const STUB_ACTION_MESSAGE = "Funkcja w przygotowaniu";

export const CONFIRM_CONTINUE_MESSAGE = "Czy na pewno kontynuować?";
