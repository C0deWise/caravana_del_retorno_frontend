"use client";

import { useEffect, useState } from "react";
import Select, { components, ClearIndicatorProps, DropdownIndicatorProps, IndicatorsContainerProps, Props as SelectProps } from "react-select";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { selectStyles } from "./select.styles";

interface SelectFieldProps extends Omit<SelectProps<any, boolean>, "styles"> {
  readonly label?: string;
  readonly error?: string;
}

const DropdownIndicator = (props: DropdownIndicatorProps<any, boolean>) => {
  return (
    <div className="flex items-center justify-center px-2 pointer-events-none">
      <ChevronDownIcon
        className={`h-4 w-4 transition-transform duration-300 text-text-muted ${
          props.selectProps.menuIsOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </div>
  );
};

const ClearIndicator = (props: ClearIndicatorProps<any, boolean>) => {
  return (
    <components.ClearIndicator {...props}>
      <XMarkIcon className="h-4 w-4 text-text-muted hover:text-danger transition-colors" />
    </components.ClearIndicator>
  );
};

const IndicatorsContainer = (props: IndicatorsContainerProps<any, boolean>) => {
  const { selectProps, hasValue } = props;
  const showCustomClear = selectProps.isClearable && !hasValue && selectProps.inputValue;

  return (
    <components.IndicatorsContainer {...props}>
      {showCustomClear && (
        <button
          type="button"
          className="flex items-center justify-center p-2 cursor-pointer group"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            selectProps.onInputChange?.("", {
              action: "input-change",
              prevInputValue: selectProps.inputValue || "",
            });
          }}
        >
          <XMarkIcon className="h-4 w-4 text-text-muted group-hover:text-danger transition-colors" />
        </button>
      )}
      {props.children}
    </components.IndicatorsContainer>
  );
};

export function SelectField({ label, error, ...props }: Readonly<SelectFieldProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={props.inputId || props.id}
          className="block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <Select
        styles={selectStyles}
        placeholder="Selecciona..."
        noOptionsMessage={() => "Sin opciones"}
        menuPortalTarget={mounted ? document.body : null}
        components={{
          DropdownIndicator,
          ClearIndicator,
          IndicatorsContainer,
        }}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
