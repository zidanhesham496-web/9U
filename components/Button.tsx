import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ type = "button", children, ...props }: ButtonProps) {
  return (
    <button className="primary-button" type={type} {...props}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">
        &#8594;
      </span>
    </button>
  );
}