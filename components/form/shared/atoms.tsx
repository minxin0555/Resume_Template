"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || hint) && (
        <div className="flex items-center justify-between gap-2 text-[11.5px] font-medium tracking-wide text-ink-soft">
          <span>{label}</span>
          {hint && (
            <span className="font-mono text-[10.5px] text-paper-muted font-normal">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">{children}</div>
  );
}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full h-9 px-2.5 bg-paper-surface border border-paper-border rounded-md text-[13px] text-ink outline-none transition-colors",
        "placeholder:text-paper-muted-2",
        "hover:border-paper-border-strong",
        "focus:border-paper-accent focus:ring-[3px] focus:ring-paper-accent/15",
        className,
      )}
      {...props}
    />
  );
});

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-16 px-2.5 py-2 bg-paper-surface border border-paper-border rounded-md text-[13px] text-ink leading-[1.55] font-sans outline-none transition-colors resize-y",
        "placeholder:text-paper-muted-2",
        "hover:border-paper-border-strong",
        "focus:border-paper-accent focus:ring-[3px] focus:ring-paper-accent/15",
        className,
      )}
      {...props}
    />
  );
});

export function IconBtn({
  danger,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-grid place-items-center size-[26px] rounded-[5px] border border-transparent bg-transparent text-paper-muted transition-colors",
        "hover:text-ink hover:bg-paper-surface-2 hover:border-paper-border",
        danger && "hover:text-paper-danger",
        className,
      )}
      {...props}
    />
  );
}

export function AddRow({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 h-8 rounded-md border border-dashed border-paper-border-strong bg-transparent text-[12px] text-paper-muted transition-colors",
        "hover:text-paper-accent-ink hover:border-paper-accent hover:bg-paper-accent-soft",
      )}
    >
      <Plus className="size-3.5" />
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  fill = false,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  fill?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex bg-paper-surface-3 border border-paper-border rounded-md p-0.5 gap-0.5",
        fill && "grid grid-flow-col auto-cols-fr w-full",
      )}
    >
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "h-[26px] px-2.5 rounded text-[12px] text-paper-muted transition-colors hover:text-ink",
              on &&
                "bg-paper-surface text-ink shadow-[0_1px_2px_oklch(0_0_0/0.05),0_0_0_1px_var(--paper-border)]",
              fill && "w-full",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}) {
  const small = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative rounded-full transition-colors border-0 flex-shrink-0 p-0",
        small ? "w-[26px] h-[16px]" : "w-[30px] h-[18px]",
        checked ? "bg-paper-accent" : "bg-paper-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] left-[2px] rounded-full bg-paper-surface shadow-[0_1px_2px_oklch(0_0_0/0.18)] transition-transform",
          small ? "size-[12px]" : "size-[14px]",
          checked
            ? small
              ? "translate-x-[10px]"
              : "translate-x-[12px]"
            : "translate-x-0",
        )}
      />
    </button>
  );
}
