"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { SearchInput } from "@/components/forms/SearchInput";
import Spinner from "@/components/feedback/Spinner";

interface AutocompleteProps<T> {
  readonly label?: string;
  readonly placeholder?: string;
  readonly onSearch: (query: string) => void;
  readonly results: T[];
  readonly loading?: boolean;
  readonly onSelect: (item: T) => void;
  readonly renderItem: (item: T, isHighlighted: boolean) => React.ReactNode;
  readonly getDisplayValue: (item: T) => string;
  readonly className?: string;
  readonly minLength?: number;
  readonly initialValue?: string;
  readonly showDropdown?: boolean;
  readonly value?: string;
  readonly debounceTime?: number;
  readonly clearOnSelect?: boolean;
}

export function Autocomplete<T>({
  label,
  placeholder = "Buscar...",
  onSearch,
  results,
  loading = false,
  onSelect,
  renderItem,
  getDisplayValue,
  className = "",
  minLength = 2,
  initialValue = "",
  showDropdown = true,
  value,
  debounceTime = 400,
  clearOnSelect = false,
}: AutocompleteProps<T>) {
  const [internalValue, setInternalValue] = useState(value ?? initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const [prevValue, setPrevValue] = useState(value);

  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && e.key !== "ArrowDown") return;

    if (!isDropdownOpen && e.key === "ArrowDown") {
      setIsDropdownOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
      case "Tab":
        setIsDropdownOpen(false);
        break;
    }
  };

  const handleSelect = useCallback(
    (item: T) => {
      const displayValue = getDisplayValue(item);
      setInternalValue(clearOnSelect ? "" : displayValue);
      onSelect(item);
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    },
    [clearOnSelect, getDisplayValue, onSelect],
  );

  const handleSearchInternal = useCallback(
    (query: string) => {
      onSearch(query);
      if (query.length >= minLength) {
        setHasSearched(true);
        if (showDropdown) setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
        setHasSearched(false);
        setHighlightedIndex(-1);
      }
    },
    [minLength, onSearch, showDropdown],
  );

  const renderDropdownContent = () => {
    if (loading && results.length === 0) {
      return (
        <div className="px-4 py-4 text-sm text-text-muted italic flex items-center justify-center gap-3">
          <Spinner size="sm" /> <span>Buscando...</span>
        </div>
      );
    }

    if (results.length === 0 && hasSearched) {
      return (
        <div className="px-4 py-4 text-sm text-text-muted text-center">
          No se encontraron resultados
        </div>
      );
    }

    return results.map((item, idx) => (
      <button
        key={`${listboxId}-option-${idx}`}
        id={`${listboxId}-option-${idx}`}
        type="button"
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setHighlightedIndex(idx)}
        className={`w-full text-left border-b border-bg-separator last:border-0 transition-all ${idx === highlightedIndex
          ? "bg-primary/10 text-primary"
          : "bg-bg text-text"
          }`}
      >
        {renderItem(item, idx === highlightedIndex)}
      </button>
    ));
  };


  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <SearchInput
        label={label}
        placeholder={placeholder}
        onSearch={handleSearchInternal}
        onChange={setInternalValue}
        loading={loading}
        minLength={minLength}
        value={internalValue}
        debounceTime={debounceTime}
        onFocus={() => {
          if (internalValue.trim().length >= minLength && results.length > 0) {
            setIsDropdownOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isDropdownOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        inputRef={inputRef}
      />

      {showDropdown && isDropdownOpen && (
        <div
          id={listboxId}
          className="absolute z-50 w-full mt-2 rounded-xl border border-bg-border bg-bg shadow-2xl overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
}

