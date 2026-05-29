"use client";

import { useState, useRef, useId } from "react";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/feedback/Spinner";

export interface SearchInputProps {
  readonly label?: string;
  readonly placeholder?: string;
  readonly onSearch: (query: string) => void;
  readonly loading?: boolean;
  readonly className?: string;
  readonly minLength?: number;
  readonly value?: string;
  readonly debounceTime?: number;
  readonly onChange?: (value: string) => void;
  readonly onFocus?: () => void;
  readonly onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly role?: string;
  readonly "aria-expanded"?: boolean;
  readonly "aria-controls"?: string;
  readonly "aria-haspopup"?: "listbox" | "dialog" | "menu" | "grid" | "tree" | "true" | "false";
  readonly inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  label,
  placeholder = "Buscar...",
  onSearch,
  loading = false,
  className = "",
  minLength = 2,
  value,
  debounceTime = 400,
  onChange,
  onFocus,
  onKeyDown,
  role,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  "aria-haspopup": ariaHasPopup,
  inputRef: externalInputRef,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [prevValue, setPrevValue] = useState(value);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const skipNextSearch = useRef(false);
  const inputId = useId();

  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  useDebouncedEffect(
    () => {
      if (skipNextSearch.current) {
        skipNextSearch.current = false;
        return;
      }

      const query = inputValue.trim();
      if (query.length >= minLength) {
        onSearch(query);
      } else if (query.length === 0) {
        onSearch("");
      }
    },
    debounceTime,
    [inputValue, minLength],
  );

  const handleClear = () => {
    skipNextSearch.current = true;
    setInputValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 ml-1"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-xl border transition-all bg-bg ${ariaExpanded
            ? "border-primary shadow-md ring-2 ring-primary/10"
            : "border-bg-border"
          }`}
      >
        <div className="pl-3 text-text-muted">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full py-3 px-3 bg-transparent outline-none text-text text-sm"
          autoComplete="off"
          role={role}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-haspopup={ariaHasPopup}
          aria-autocomplete={role === "combobox" ? "list" : undefined}
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
    </div>
  );
}

