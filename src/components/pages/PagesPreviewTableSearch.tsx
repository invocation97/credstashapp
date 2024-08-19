"use client";
import { SearchIcon } from "lucide-react";
import React, { useCallback, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function PagesPreviewTableSearch({ q }: { q: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(q);

  // Debounce the search input value
  const debouncedSearch = useDebounce(search, 500);

  const createQueryString = useCallback(
    (query: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(query, value);
      } else {
        params.delete(query);
      }

      return params.toString();
    },
    [searchParams]
  );

  // Effect to update the URL when the debounced search value changes
  useEffect(() => {
    if (debouncedSearch !== q) {
      router.push(`${pathname}?${createQueryString("q", debouncedSearch)}`);
    }
  }, [debouncedSearch, pathname, router, q, createQueryString]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search pages..."
        className="pl-8 w-[300px]"
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
}
