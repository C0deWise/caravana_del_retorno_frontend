"use client";

import { useState, useCallback } from "react";
import { SliderPill } from "@/components/layout/SliderPill";
import { Autocomplete } from "@/components/forms/Autocomplete";
import { SearchInput } from "@/components/forms/SearchInput";
import { useUserSearch } from "@/hooks/useUserSearch";
import { USER_SEARCH_MODES, UserSearchMode, UserSearchResult } from "@/types/user.types";

interface UserSearchFieldProps {
  readonly variant?: "autocomplete" | "simple";
  readonly onSelect?: (user: UserSearchResult) => void;
  readonly onSearch?: (query: string, mode: UserSearchMode) => void;
  readonly onModeChange?: (mode: UserSearchMode) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly label?: string;
}

export function UserSearchField({
  variant = "autocomplete",
  onSelect,
  onSearch,
  onModeChange,
  placeholder,
  className = "",
  label,
}: UserSearchFieldProps) {
  const [searchType, setSearchType] = useState<UserSearchMode>("nombre");
  const { search, results, loading } = useUserSearch();

  const handleSearchInternal = useCallback(
    (query: string) => {
      search(searchType, query);
      onSearch?.(query, searchType);
    },
    [search, searchType, onSearch],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de modo de búsqueda */}
      <div className="relative flex bg-bg-card p-1 rounded-xl border border-bg-border overflow-hidden">
        <SliderPill activeValue={searchType} />
        {USER_SEARCH_MODES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setSearchType(type);
              onModeChange?.(type);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${
              searchType === type ? "text-primary" : "text-text-muted hover:text-text"
            }`}
          >
            {type === "documento" ? "Por Documento" : "Por Nombre"}
          </button>
        ))}
      </div>

      {/* Campo de búsqueda según la variante */}
      {variant === "autocomplete" ? (
        <Autocomplete<UserSearchResult>
          key={searchType}
          label={label}
          placeholder={
            placeholder ||
            (searchType === "documento" ? "Ej: 123456..." : "Ej: Juan Pérez...")
          }
          onSearch={handleSearchInternal}
          results={results}
          loading={loading}
          onSelect={(user) => onSelect?.(user)}
          getDisplayValue={(user) =>
            searchType === "documento" ? user.documento : `${user.nombre} ${user.apellido}`
          }
          renderItem={(user, isHighlighted) => (
            <div className="px-4 py-2.5">
              <p className={`text-sm font-semibold ${isHighlighted ? "text-primary" : "text-text"}`}>
                {user.nombre} {user.apellido}
              </p>
              <p className="text-xs text-text-muted">{user.documento}</p>
            </div>
          )}
          clearOnSelect
        />
      ) : (
        <SearchInput
          key={searchType}
          label={label}
          placeholder={
            placeholder ||
            (searchType === "documento" ? "Ej: 123456..." : "Ej: Juan Pérez...")
          }
          onSearch={handleSearchInternal}
          loading={loading}
          debounceTime={400}
        />
      )}
    </div>
  );
}

