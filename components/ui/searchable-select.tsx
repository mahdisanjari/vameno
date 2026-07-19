"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
}

export function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  searchPlaceholder = "جستجو...",
  emptyText = "موردی یافت نشد",
  clearable = true,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return options;
    return options.filter((o) => o.label.includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-neutral-300 bg-white px-4 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400",
        )}
      >
        <span className={selected ? "text-neutral-900" : "text-neutral-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={cn("shrink-0 text-neutral-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card-hover animate-fade-in">
          <div className="relative border-b border-neutral-100 p-2">
            <Search size={15} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border-0 bg-neutral-50 py-2 pl-3 pr-9 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {clearable && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center px-4 py-2 text-right text-sm text-neutral-400 hover:bg-neutral-50"
                >
                  بدون انتخاب
                </button>
              </li>
            )}
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-center text-xs text-neutral-400">{emptyText}</li>
            ) : (
              filtered.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-right text-sm hover:bg-neutral-50",
                      value === o.id && "bg-primary-50 text-primary-700",
                    )}
                  >
                    {o.label}
                    {value === o.id && <Check size={14} />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
