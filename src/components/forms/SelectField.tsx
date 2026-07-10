"use client";

import { useEffect, useState, useId } from "react";
import Select, { components, ClearIndicatorProps, DropdownIndicatorProps, IndicatorsContainerProps, Props as SelectProps, GroupBase } from "react-select";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getSelectStyles, SelectOption } from "./select.styles";

interface SelectFieldProps<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<SelectProps<Option, IsMulti, Group>, "styles"> {
  readonly label?: string;
  readonly hasError?: boolean;
  readonly errorMessage?: string;
  readonly errorClassName?: string;
}

const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
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

const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ClearIndicatorProps<Option, IsMulti, Group>
) => {
  return (
    <components.ClearIndicator {...props}>
      <XMarkIcon className="h-4 w-4 text-text-muted hover:text-danger transition-colors" />
    </components.ClearIndicator>
  );
};

const IndicatorsContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: IndicatorsContainerProps<Option, IsMulti, Group>
) => {
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

export function SelectField<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ label, hasError, errorMessage, errorClassName = "absolute -bottom-5 left-1", ...props }: Readonly<SelectFieldProps<Option, IsMulti, Group>>) {
  const [mounted, setMounted] = useState(false);

  const instanceId = useId();

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  return (
    <div className={`relative transition-opacity duration-300 ${props.isDisabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
      {label && (
        <label
          htmlFor={props.inputId || props.id}
          className="block text-sm font-medium text-text mb-1.5"
        >
          {label}
        </label>
      )}
      <Select
        instanceId={instanceId}
        styles={getSelectStyles<Option, IsMulti, Group>(hasError || !!errorMessage)}
        placeholder="Selecciona..."
        noOptionsMessage={() => "Sin opciones"}
        menuPortalTarget={mounted ? document.body : null}
        menuPosition="fixed"
        maxMenuHeight={314}
        components={{
          DropdownIndicator,
          ClearIndicator,
          IndicatorsContainer,
        }}
        {...props}
      />
      {(hasError || errorMessage) && errorMessage && (
        <p className={`text-accent-red text-xs font-medium z-10 ${errorClassName}`}>{errorMessage}</p>
      )}
    </div>
  );
}
