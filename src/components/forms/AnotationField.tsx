interface AnotacionFieldProps {
    readonly value: string;
    readonly maxLength: number;
    readonly onChange: (value: string) => void;
}

export function AnotacionField({ value, maxLength, onChange }: AnotacionFieldProps) {
    return (
        <div>
            <label htmlFor="anotacion" className="label-primary mb-0">
                Notas adicionales{" "}
                <span className="validation-message validation-info mt-1">(Opcional)</span>
            </label>
            <textarea
                id="anotacion"
                className="textarea-base mt-2"
                rows={3}
                maxLength={maxLength}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Escribe aquí cualquier información relevante para tu grupo (máximo ${maxLength} caracteres)...`}
            />
            <p className="validation-message validation-info mt-1 text-right">
                {value.length}/{maxLength}
            </p>
        </div>
    );
}