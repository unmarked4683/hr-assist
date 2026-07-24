"use client";

import Fuse from "fuse.js";
import { useMemo } from "react";

import type { EmployeeSummary } from "@/lib/types/employee";

const FUSE_OPTIONS = {
  keys: [
    { name: "firstName", weight: 0.25 },
    { name: "lastName", weight: 0.25 },
    { name: "position", weight: 0.2 },
    { name: "location", weight: 0.15 },
    { name: "pesel", weight: 0.15 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

export function useEmployeeSearch(
  employees: EmployeeSummary[],
  query: string,
): EmployeeSummary[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return employees;

    const fuse = new Fuse(employees, FUSE_OPTIONS);
    return fuse.search(trimmed).map((result) => result.item);
  }, [employees, query]);
}
