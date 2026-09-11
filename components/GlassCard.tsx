import type { HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLElement>;

export function GlassCard({ children, ...props }: GlassCardProps) {
  const { className, ...sectionProps } = props;

  return (
    <section
      className={`glass-card ${className ?? ""}`.trim()}
      {...sectionProps}
    >
      {children}
    </section>
  );
}