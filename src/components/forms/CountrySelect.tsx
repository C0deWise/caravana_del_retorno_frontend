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
  const countryOptions = useMemo(() => {
    const all = getAllCountries();
    const colombia = all.find((c) => c.name === "Colombia");
    const others = all
      .filter((c) => c.name !== "Colombia")
      .map((country) => ({
        value: country.name,
        label: country.name,
      }));

    if (!colombia) {
      return [{ label: "Todos los países", options: others }];
    }

    return [
      {
        label: "",
        options: [{ value: colombia.name, label: colombia.name }],
      },
      {
        label: "",
        options: others,
      },
    ];
  }, []);

  const selectedOption =
    countryOptions.flatMap((group) => group.options).find((opt) => opt.value === value) || null;

  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || "");
  };

  return (
    <SelectField<SelectOption>
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
      classNames={{
        group: () => "!py-0",
        groupHeading: () => "!py-0 !mb-0",
      }}
      formatGroupLabel={(group) =>
        group.options.some((opt) => opt.value === "Colombia") ? null : (
          <div className="py-1.5 flex items-center justify-center">
            <div className="h-1 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
          </div>
        )
      }
    />
  );
}
