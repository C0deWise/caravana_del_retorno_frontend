'use client'

import { useMemo } from 'react';
import Select, { type StylesConfig } from 'react-select';
import { getAllCountries } from '@/shared/constants/countries';

type SelectOption = {
    value: string;
    label: string;
};

type CountrySelectProps = {
    value: string;
    onChange: (country: string) => void;
    instanceId?: string;
    inputId?: string;
    label?: string;
    placeholder?: string;
    isSearchable?: boolean;
    isClearable?: boolean;
    openMenuOnFocus?: boolean;
    isDisabled?: boolean;
    styles?: StylesConfig<SelectOption, false>;
    noOptionsMessage?: () => string;
};

export default function CountrySelect({
    value,
    onChange,
    instanceId,
    inputId,
    label = 'País',
    placeholder = 'Seleccione un país',
    isSearchable = true,
    isClearable = true,
    openMenuOnFocus = true,
    isDisabled = false,
    styles,
    noOptionsMessage = () => 'No se encontraron países',
}: CountrySelectProps) {
    const countryOptions = useMemo(
        () => getAllCountries().map((country) => ({ value: country.name, label: country.name })),
        []
    );

    const selectedOption = countryOptions.find((opt) => opt.value === value) || null;

    const handleChange = (option: SelectOption | null) => {
        onChange(option?.value || '');
    };

    return (
        <div>
            <label className="label-base" htmlFor={inputId}>
                {label}
            </label>
            <Select
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
                styles={styles}
                noOptionsMessage={noOptionsMessage}
            />
        </div>
    );
}
