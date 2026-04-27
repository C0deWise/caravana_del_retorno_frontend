import type { StylesConfig } from "react-select";

type SelectOption = {
  value: string;
  label: string;
};

export const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    borderColor: state.isFocused
      ? "var(--color-primary)"
      : "var(--color-bg-border)",
    borderRadius: "0.75rem",
    padding: "0.2rem",
    fontSize: "0.875rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(2, 64, 89, 0.1)" : "none",
    transition: "all 0.2s ease",
    ":hover": {
      borderColor: state.isFocused
        ? "var(--color-primary)"
        : "var(--color-bg-border)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    borderRadius: "0.75rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "0.25rem",
    border: "1px solid var(--color-bg-border)",
    overflow: "hidden",
    zIndex: 9999,
    marginTop: "0.5rem",
    animation: "fade-in 0.2s ease-out, zoom-in 0.2s ease-out",
  }),
  option: (base, state) => {
    let backgroundColor = "transparent";
    if (state.isSelected) {
      backgroundColor = "var(--color-primary)";
    } else if (state.isFocused) {
      backgroundColor = "rgba(2, 64, 89, 0.08)";
    }

    return {
      ...base,
      backgroundColor,
      color: state.isSelected
        ? "var(--color-text-inverse)"
        : "var(--color-text)",
      padding: "0.625rem 1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? "600" : "400",
      ":active": {
        backgroundColor: "rgba(2, 64, 89, 0.15)",
      },
      borderBottom: "1px solid var(--color-bg-separator)",
      ":last-child": {
        borderBottom: "none",
      },
    };
  },
  placeholder: (base) => ({
    ...base,
    color: "var(--color-text-muted)",
    fontSize: "0.875rem",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text)",
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
};
