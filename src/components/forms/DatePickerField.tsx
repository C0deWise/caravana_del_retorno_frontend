import React, { useId } from "react";
import { createPortal } from "react-dom";
import DatePicker, { DatePickerProps, registerLocale } from "react-datepicker";
import Select, { DropdownIndicatorProps } from "react-select";
import { getSelectStyles } from "./select.styles";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.styles.css";
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { es } from "date-fns/locale/es";

registerLocale("es", es);

const DropdownIndicator = (props: DropdownIndicatorProps<unknown>) => {
  return (
    <div className="flex items-center justify-center px-1 pointer-events-none">
      <ChevronDown
        className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${
          props.selectProps.menuIsOpen ? "rotate-180" : ""
        }`}
      />
    </div>
  );
};

type SingleDatePickerProps = Extract<DatePickerProps, { selectsRange?: false; selectsMultiple?: false }>;

export interface DatePickerFieldProps extends Omit<SingleDatePickerProps, "onChange"> {
  label?: string;
  errorMessage?: string;
  hasError?: boolean;
  errorClassName?: string;
  onChange: (date: Date | null) => void;
}

export function DatePickerField({
  label,
  errorMessage,
  hasError,
  errorClassName = "absolute -bottom-5 left-1",
  className = "",
  id,
  selected,
  onChange,
  ...props
}: DatePickerFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const isDateEmpty = !selected;
  const textColor = isDateEmpty ? "text-gray-400/60" : "text-gray-900";

  const baseInputClass =
    `w-full px-4 py-3 rounded-xl border bg-white ${textColor} transition-all outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400/60 cursor-pointer caret-transparent`;
  const errorInputClass = hasError
    ? "border-accent-red focus:border-accent-red"
    : "border-gray-300 focus:border-primary hover:border-gray-400";

  const inputClass = `${baseInputClass} ${errorInputClass} pr-10 ${className}`;

  const [isOpen, setIsOpen] = React.useState(false);
  const datePickerRef = React.useRef<DatePicker>(null);

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {isOpen && typeof document !== "undefined" && createPortal(
          <div 
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              datePickerRef.current?.setOpen(false);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              datePickerRef.current?.setOpen(false);
            }}
          />,
          document.body
        )}
        <DatePicker
          selectsMultiple={false}
          selectsRange={false}
          ref={datePickerRef}
          id={inputId}
          selected={selected}
          onCalendarOpen={() => setIsOpen(true)}
          onCalendarClose={() => setIsOpen(false)}
          onClickOutside={() => datePickerRef.current?.setOpen(false)}
          onChange={(date: unknown) => {
            if (!Array.isArray(date)) {
              onChange(date as Date | null);
            }
          }}
          className={inputClass}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
          locale="es"
          portalId="datepicker-portal"
          wrapperClassName="w-full"
          customInput={<input readOnly inputMode="none" />}
          onChangeRaw={(e) => e?.preventDefault()}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            const months = [
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            const years = Array.from(
              { length: 100 },
              (_, i) => new Date().getFullYear() - i
            );
            return (
              <div className="flex items-center justify-between px-2 py-2">
                <button
                  type="button"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex gap-2">
                  <Select
                    value={{ value: date.getMonth(), label: months[date.getMonth()] }}
                    options={months.map((m, i) => ({ value: i, label: m }))}
                    onChange={(option) => changeMonth((option as { value: number } | null)?.value as number)}
                    isSearchable={false}
                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                    menuPosition="fixed"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    styles={{
                      ...getSelectStyles<unknown>(),
                      control: (base: unknown, state: unknown) => ({
                        ...(getSelectStyles<unknown>().control?.(base as never, state as never) || {}),
                        minHeight: "32px",
                        padding: "0 0.25rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        width: "135px",
                      }),
                      valueContainer: (base: unknown) => ({
                        ...(base as object),
                        padding: "0 4px",
                      }),
                      singleValue: (base: unknown) => ({
                        ...(base as object),
                        color: "#1f2937",
                      })
                    } as React.ComponentProps<typeof Select>["styles"]}
                  />

                  <Select
                    value={{ value: date.getFullYear(), label: date.getFullYear().toString() }}
                    options={years.map((y) => ({ value: y, label: y.toString() }))}
                    onChange={(option) => changeYear((option as { value: number } | null)?.value as number)}
                    isSearchable={false}
                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                    menuPosition="fixed"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    styles={{
                      ...getSelectStyles<unknown>(),
                      control: (base: unknown, state: unknown) => ({
                        ...(getSelectStyles<unknown>().control?.(base as never, state as never) || {}),
                        minHeight: "32px",
                        padding: "0 0.25rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        width: "100px",
                      }),
                      valueContainer: (base: unknown) => ({
                        ...(base as object),
                        padding: "0 4px",
                      }),
                      singleValue: (base: unknown) => ({
                        ...(base as object),
                        color: "#1f2937",
                      })
                    } as React.ComponentProps<typeof Select>["styles"]}
                  />
                </div>

                <button
                  type="button"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            );
          }}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 transition-colors pointer-events-none">
          <CalendarIcon className="w-5 h-5" />
        </div>
      </div>
      {hasError && errorMessage && (
        <p className={`text-accent-red text-xs font-medium z-10 ${errorClassName}`}>{errorMessage}</p>
      )}
    </div>
  );
}
