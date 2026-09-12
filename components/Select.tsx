import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
};

export function Select({ label, id, name, options, error, placeholder = "اختر موهبتك", ...props }: SelectProps) {
  const selectId = id ?? name;
  const errorId = `${selectId}-error`;

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={selectId}>
        <span>{label}</span>
        {props.required && <span className="required-mark">مطلوب</span>}
      </label>
      <select
        className={`field-control field-select ${error ? "field-control-error" : ""}`.trim()}
        id={selectId}
        name={name}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}