"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Spinner from "@/ui/animations/Spinner";

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
  value, // Recibimos el valor externo
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [prevValue, setPrevValue] = useState(value);

  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextSearch = useRef(false);
  const listboxId = useId();

  useDebouncedEffect(
    () => {
      if (skipNextSearch.current) {
        skipNextSearch.current = false;
        return;
      }

      const query = inputValue.trim();
      if (query.length >= minLength) {
        onSearch(query);
        setHasSearched(true);
        if (showDropdown) setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
        setHasSearched(false);
        setHighlightedIndex(-1);
        if (query.length === 0) onSearch("");
      }
    },
    400,
    [inputValue, minLength, onSearch]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
        setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
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

  const handleSelect = (item: T) => {
    skipNextSearch.current = true;
    const value = getDisplayValue(item);
    setInputValue(value);
    onSelect(item);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    skipNextSearch.current = true;
    setInputValue("");
    onSearch("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    setHasSearched(false);
    inputRef.current?.focus();
  };

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
        className={`w-full text-left border-b border-bg-separator last:border-0 transition-all ${idx === highlightedIndex ? "bg-primary/10 text-primary" : "bg-bg text-text"
          }`}
      >
        {renderItem(item, idx === highlightedIndex)}
      </button>
    ));
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={listboxId + "-input"}
          className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 ml-1"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-xl border transition-all bg-bg ${isDropdownOpen
          ? "border-primary shadow-md ring-2 ring-primary/10"
          : "border-bg-border"
          }`}
      >
        <div className="pl-3 text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </div>

        <input
          id={listboxId + "-input"}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim().length >= minLength && results.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full py-3 px-3 bg-transparent outline-none text-text text-sm"
          autoComplete="off"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        <div className="pr-3 flex items-center gap-2">
          {loading && (
            <Spinner size="sm" className="text-primary animate-spin" />
          )}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-text-muted hover:text-accent-red transition-colors p-0.5 rounded-md hover:bg-accent-red/10"
              aria-label="Limpiar búsqueda"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

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
