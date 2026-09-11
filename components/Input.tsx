import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, id, name, error, ...props }: InputProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={inputId}>
        <span>{label}</span>
        {props.required && <span className="required-mark">مطلوب</span>}
      </label>
      <input
        className={`field-control ${error ? "field-control-error" : ""}`.trim()}
        id={inputId}
        name={name}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}