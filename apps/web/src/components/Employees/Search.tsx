"use client";

import { Search as SearchIcon, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import { useDebouncedCallback } from "use-debounce";

interface EmployeesSearchProps {
  onAddClick?: () => void;
}

export function Search({ onAddClick }: EmployeesSearchProps) {
  const SEARCH_QUERY_PARAM = "search";
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set(SEARCH_QUERY_PARAM, term);
    } else {
      params.delete(SEARCH_QUERY_PARAM);
    }
    replace(`${pathname}?${params.toString()}` as Route);
  }, 100);

  return (
    <header className="flex max-w-full shrink-0 items-center gap-3 border-b border-border bg-card px-6 py-4">
      <div className="relative flex-1 grow">
        <SearchIcon
          size={15}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Szukaj pracowników..."
          onChange={(event) => handleSearch(event.target.value)}
          defaultValue={searchParams.get(SEARCH_QUERY_PARAM)?.toString() ?? ""}
          className="h-9 w-full rounded-lg border border-input bg-background pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
        aria-label="Dodaj pracownika"
      >
        <Plus size={18} />
      </button>
    </header>
  );
}
