import { type ComponentProps } from "react";

import { ChevronDownIcon } from "@/components/icons/chevron-icons";
import { cn } from "@/lib/cn";

const inputClass =
  "h-[46px] w-full min-w-0 rounded-lg bg-white px-4 text-sm outline-none placeholder:text-[#b5b5b5] ring-primary transition-shadow focus:ring-2 aria-invalid:ring-2 aria-invalid:ring-danger";

type FieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

function Message({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  const message = error ?? hint;
  if (!message) return null;
  return (
    <p id={id} className={cn("text-[11px]", error ? "text-danger" : "text-muted")}>
      {message}
    </p>
  );
}

export function MyTextField({ id, label, hint, error, className, ...props }: FieldProps) {
  const messageId = error || hint ? `${id}-message` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={messageId}
        className={cn(inputClass, className)}
        {...props}
      />
      <Message id={`${id}-message`} hint={hint} error={error} />
    </div>
  );
}

export function MyPhoneField({ id, label, error, ...props }: Omit<FieldProps, "type" | "hint">) {
  const messageId = error ? `${id}-message` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="relative">
          {/* 서버가 010 번호만 받으므로 국가 코드는 +82 하나만 둔다 */}
          <select
            aria-label="국가 코드"
            defaultValue="+82"
            className="h-[46px] w-[84px] appearance-none rounded-lg bg-white pr-8 pl-4 text-sm ring-primary outline-none focus:ring-2"
          >
            <option value="+82">+82</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="01012345678"
          maxLength={11}
          aria-invalid={!!error}
          aria-describedby={messageId}
          className={inputClass}
          {...props}
        />
      </div>
      <Message id={`${id}-message`} error={error} />
    </div>
  );
}

export const PASSWORD_HINT = "8자 이상 - 16자 이하의 영문, 숫자, 특수문자를 포함해 주세요.";
