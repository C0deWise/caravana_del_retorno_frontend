interface StepperFieldProps {
    readonly legend: string;
    readonly value: number;
    readonly max: number;
    readonly onDecrement: () => void;
    readonly onIncrement: () => void;
    readonly error?: string;
    readonly incrementDisabled?: boolean;
}

export function StepperField({
    legend,
    value,
    max,
    onDecrement,
    onIncrement,
    error,
    incrementDisabled = false,
}: StepperFieldProps) {
    return (
        <fieldset>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <legend className="label-primary mb-0">{legend}</legend>
                <div className="stepper">
                    <button
                        type="button"
                        onClick={onDecrement}
                        disabled={value === 0}
                        className="stepper-btn"
                    >
                        -
                    </button>
                    <div className="stepper-display">
                        <span className="stepper-label">
                            {value ? "Necesita" : "No necesita"}
                        </span>
                        <span className="stepper-value">
                            {value}/{max}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onIncrement}
                        disabled={value === max || incrementDisabled}
                        className="stepper-btn"
                    >
                        +
                    </button>
                </div>
            </div>
            {error && (
                <p className="validation-error text-sm mt-1">{error}</p>
            )}
        </fieldset>
    );
}