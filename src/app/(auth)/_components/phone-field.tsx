import { type ComponentProps } from "react";

import { ChevronDownIcon } from "@/components/icons/chevron-icons";

type Props = Omit<ComponentProps<"input">, "type"> & {
  label?: string;
  error?: string;
};

export function PhoneField({ id, label, error, ...props }: Props) {
  const errorId = error ? `${id}-message` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[15px] font-medium">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        <div className="relative">
          {/* 서버가 010 번호만 받으므로 국가 코드는 +82 하나만 둔다 */}
          <select
            aria-label="국가 코드"
            defaultValue="+82"
            className="h-[50px] w-[90px] appearance-none rounded-lg bg-field pr-9 pl-[15px] text-[15px] ring-primary outline-none focus:ring-2"
          >
            <option value="+82">+82</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-[13px] size-4 -translate-y-1/2" />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="01012345678"
          maxLength={11}
          aria-label={label ? undefined : "휴대폰 번호"}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="h-[50px] min-w-0 flex-1 rounded-lg bg-field px-[15px] text-[15px] ring-primary transition-shadow outline-none placeholder:text-[#c4c4c4] focus:ring-2 aria-invalid:ring-2 aria-invalid:ring-danger"
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
