import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Props = ComponentProps<"button"> & {
  variant?: "solid" | "outline";
  size?: "md" | "lg";
};

export function Button({ variant = "solid", size = "lg", className, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full font-semibold transition-opacity disabled:opacity-60",
        size === "lg" ? "h-12 text-[15px]" : "h-10 text-sm",
        variant === "solid"
          ? "bg-primary text-white"
          : "border border-primary bg-white text-primary",
        className,
      )}
      {...props}
    />
  );
}
