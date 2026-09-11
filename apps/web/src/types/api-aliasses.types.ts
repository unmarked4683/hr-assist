import { paths } from "./api.types";

export type Employee =
  paths["/api/employees"]["get"]["responses"]["200"]["content"]["application/json"][number];
