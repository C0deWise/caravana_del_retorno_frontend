"use client";

import { useState, useCallback, useRef } from "react";
import { SliderPill } from "@/components/layout/SliderPill";
import { SearchInput } from "@/components/forms/SearchInput";
import { useUserSearch } from "@/hooks/useUserSearch";
import { USER_SEARCH_MODES, UserSearchMode, UserSearchResult } from "@/types/user.types";
import { SelectField } from "@/components/forms/SelectField";
import { useAuth } from "@/auth/context/AuthContext";

interface UserSearchFieldProps {
  readonly variant?: "autocomplete" | "simple";
  readonly onSelect?: (user: UserSearchResult) => void;
  readonly onSearch?: (query: string, mode: UserSearchMode) => void;
  readonly onModeChange?: (mode: UserSearchMode) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly label?: string;
  readonly initialMode?: UserSearchMode;
  readonly excludeIds?: number[];
  readonly showModeSelector?: boolean;
}

export function UserSearchField({
  variant = "autocomplete",
  onSelect,
  onSearch,
  onModeChange,
  placeholder,
  className = "",
  label,
  initialMode = "general",
  excludeIds = [],
  showModeSelector = false,
}: Readonly<UserSearchFieldProps>) {
  const { user: currentUser } = useAuth();
  const [searchType, setSearchType] = useState<UserSearchMode>(initialMode);
  const [inputValue, setInputValue] = useState("");
  const { search, results, loading, error } = useUserSearch();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInternal = useCallback(
    (query: string, { action }: { action: string }) => {
      if (action === "input-blur" || action === "menu-close") {
        return;
      }

      setInputValue(query);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (action === "input-change" && query.length === 0) {
        search(searchType, "");
        return;
      }

      if (query.length >= 2) {
        debounceTimerRef.current = setTimeout(() => {
          search(searchType, query);
          onSearch?.(query, searchType);
        }, 500);
      }
    },
    [search, searchType, onSearch],
  );

  const filteredResults = results.filter((u) => {
    if (u.id === currentUser?.id) return false;
    if (u.codigo_rol === 3) return false;
    if (excludeIds.includes(u.id)) return false;
    return true;
  });

  const selectOptions = filteredResults.map((user) => ({
    value: user.id.toString(),
    label: `${user.nombre} ${user.apellido} (${user.documento})`,
    user,
  }));

  const getModeLabel = (mode: UserSearchMode) => {
    switch (mode) {
      case "general":
        return "General";
      case "nombre":
        return "Nombre";
      case "documento":
        return "Documento";
      default:
        return mode;
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    switch (searchType) {
      case "documento":
        return "Ej: 123456...";
      case "nombre":
        return "Ej: Juan Pérez...";
      case "general":
        return "Nombre o documento...";
      default:
        return "Buscar...";
    }
  };

  const handleSearchSimple = useCallback(
    (query: string) => {
      if (query.length === 0) {
        search(searchType, "");
        return;
      }
      
      if (query.length >= 2) {
        search(searchType, query);
        onSearch?.(query, searchType);
      }
    },
    [search, searchType, onSearch],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de modo de búsqueda */}
      {showModeSelector && (
        <div className="relative flex bg-bg-card p-1 rounded-xl border border-bg-border overflow-hidden">
          <SliderPill activeValue={searchType} options={[...USER_SEARCH_MODES]} />
          {USER_SEARCH_MODES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSearchType(type);
                onModeChange?.(type);
              }}
              className={`relative z-10 flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${
                searchType === type ? "text-primary" : "text-text-muted hover:text-text"
              }`}
            >
              {getModeLabel(type)}
            </button>
          ))}
        </div>
      )}

      {/* Campo de búsqueda según la variante */}
      {variant === "autocomplete" ? (
        <SelectField
          key={searchType}
          label={label}
          inputId="user-search-autocomplete"
          placeholder={getPlaceholder()}
          inputValue={inputValue}
          onInputChange={handleSearchInternal}
          options={selectOptions}
          isLoading={loading}
          loadingMessage={() => "Buscando..."}
          onChange={(option) => {
            if (option) {
              setInputValue("");
              onSelect?.(option.user);
            }
          }}
          noOptionsMessage={({ inputValue: currentInput }) => {
            if (error) return error;
            return currentInput.length < 2 && currentInput.length > 0
              ? "Escribe al menos 2 caracteres..."
              : "No se encontraron usuarios";
          }}
          isClearable
          filterOption={() => true}
        />
      ) : (
        <div className="space-y-2">
          <SearchInput
            key={searchType}
            label={label}
            placeholder={getPlaceholder()}
            onSearch={handleSearchSimple}
            loading={loading}
            debounceTime={400}
          />
          {error && <p className="text-xs text-danger px-1">{error}</p>}
        </div>
      )}
    </div>
  );
}
