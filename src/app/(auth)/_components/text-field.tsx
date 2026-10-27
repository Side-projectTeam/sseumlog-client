import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Props = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function TextField({ id, label, hint, error, className, ...props }: Props) {
  const message = error ?? hint;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[15px] font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={messageId}
        className={cn(
          "h-[50px] rounded-lg bg-field px-[15px] text-[15px] outline-none placeholder:text-muted",
          "ring-primary transition-shadow focus:ring-2 aria-invalid:ring-2 aria-invalid:ring-danger",
          className,
        )}
        {...props}
      />
      {message && (
        <p id={messageId} className={cn("text-xs", error ? "text-danger" : "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
}
