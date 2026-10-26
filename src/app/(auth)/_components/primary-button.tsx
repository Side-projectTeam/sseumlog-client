import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Props = ComponentProps<"button"> & {
  variant?: "solid" | "outline";
};

export function PrimaryButton({ variant = "solid", className, ...props }: Props) {
  return (
    <button
      className={cn(
        "h-[50px] rounded-lg text-base font-semibold transition-opacity disabled:opacity-60",
        variant === "solid"
          ? "bg-primary text-white"
          : "border border-primary bg-white text-primary",
        className,
      )}
      {...props}
    />
  );
}
