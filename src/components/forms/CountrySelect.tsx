import { useMemo } from "react";
import { SelectField } from "@/components/forms/SelectField";
import { getAllCountries } from "@/constants/countries";

type SelectOption = {
  value: string;
  label: string;
};

type CountrySelectProps = {
  readonly value: string;
  readonly onChange: (country: string) => void;
  readonly instanceId?: string;
  readonly inputId?: string;
  readonly label?: string;
  readonly placeholder?: string;
  readonly isSearchable?: boolean;
  readonly isClearable?: boolean;
  readonly openMenuOnFocus?: boolean;
  readonly isDisabled?: boolean;
  readonly noOptionsMessage?: () => string;
};

export default function CountrySelect({
  value,
  onChange,
  instanceId,
  inputId,
  label = "País",
  placeholder = "Seleccione un país",
  isSearchable = true,
  isClearable = true,
  openMenuOnFocus = true,
  isDisabled = false,
  noOptionsMessage = () => "No se encontraron países",
}: CountrySelectProps) {
  const countryOptions = useMemo(
    () =>
      getAllCountries().map((country) => ({
        value: country.name,
        label: country.name,
      })),
    [],
  );

  const selectedOption =
    countryOptions.find((opt) => opt.value === value) || null;

  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || "");
  };

  return (
    <SelectField
      label={label}
      instanceId={instanceId}
      inputId={inputId}
      options={countryOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={isClearable}
      openMenuOnFocus={openMenuOnFocus}
      isDisabled={isDisabled}
      noOptionsMessage={noOptionsMessage}
    />
  );
}
