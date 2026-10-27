"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useId, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/features/home/categories";
import type { CategoryId } from "@/features/home/types";
import { EMOTIONS, SATISFACTIONS } from "@/features/record/options";
import { useCreateRecord, useRecord, useUpdateRecord } from "@/features/record/queries";
import { recordFormSchema, type RecordFormValues } from "@/features/record/schemas";
import type { SpendingRecord, SpendingRecordInput } from "@/features/record/types";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";

import { todayString } from "./format";

type CreateProps = {
  category?: CategoryId;
  onDone: () => void;
  onClose: () => void;
};

export function CreateRecordSheet({ category, onDone, onClose }: CreateProps) {
  const createMutation = useCreateRecord();

  return (
    <BottomSheet
      title="새 소비 기록 등록하기"
      description="오늘의 소비와 그때의 마음을 기록해보세요."
      onClose={onClose}
    >
      <RecordForm
        defaultValues={{
          imageUrl: null,
          price: "",
          purchasedAt: todayString(),
          category,
          memo: "",
          place: "",
        }}
        pending={createMutation.isPending}
        error={createMutation.isError ? getApiErrorMessage(createMutation.error) : undefined}
        onSubmit={(input) => createMutation.mutate(input, { onSuccess: onDone })}
      />
    </BottomSheet>
  );
}

type EditProps = {
  id: number;
  onDone: () => void;
  onClose: () => void;
};

export function EditRecordSheet({ id, onDone, onClose }: EditProps) {
  const { data: record } = useRecord(id);
  const updateMutation = useUpdateRecord(id);

  return (
    <BottomSheet title="소비 기록 수정" onClose={onClose}>
      {record ? (
        <RecordForm
          defaultValues={toFormValues(record)}
          pending={updateMutation.isPending}
          error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : undefined}
          onSubmit={(input) => updateMutation.mutate(input, { onSuccess: onDone })}
        />
      ) : (
        <div aria-hidden className="h-[60dvh] animate-pulse rounded-lg bg-field" />
      )}
    </BottomSheet>
  );
}

function toFormValues(record: SpendingRecord): RecordFormValues {
  const { id: _id, liked: _liked, price, ...rest } = record;
  return { ...rest, price: price.toLocaleString("ko-KR") };
}

type FormProps = {
  defaultValues: Partial<RecordFormValues>;
  pending: boolean;
  error?: string;
  onSubmit: (input: SpendingRecordInput) => void;
};

function RecordForm({ defaultValues, pending, error, onSubmit }: FormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });

  const submit = handleSubmit(({ price, memo, place, ...values }) =>
    onSubmit({
      ...values,
      price: Number(price.replaceAll(",", "")),
      memo: memo.trim(),
      place: place.trim(),
    }),
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 pt-1">
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => <PhotoPicker value={field.value} onChange={field.onChange} />}
      />

      <Row label="가격" htmlFor="price" error={errors.price?.message}>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <div className="relative">
              <input
                id="price"
                inputMode="numeric"
                placeholder="0"
                aria-invalid={!!errors.price}
                className={cn(fieldClass, "pr-8")}
                {...field}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
                  field.onChange(digits ? Number(digits).toLocaleString("ko-KR") : "");
                }}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-muted">
                원
              </span>
            </div>
          )}
        />
      </Row>

      <Row label="구매일" htmlFor="purchasedAt" error={errors.purchasedAt?.message}>
        <input
          id="purchasedAt"
          type="date"
          max={todayString()}
          aria-invalid={!!errors.purchasedAt}
          className={fieldClass}
          {...register("purchasedAt")}
        />
      </Row>

      <Row label="카테고리" htmlFor="category" error={errors.category?.message}>
        <div className="relative">
          <select
            id="category"
            aria-invalid={!!errors.category}
            className={cn(fieldClass, "appearance-none pr-9")}
            {...register("category")}
          >
            <option value="">카테고리 선택</option>
            {Object.entries(CATEGORIES).map(([id, { name }]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
          >
            <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </Row>

      <Row label="만족도" as="fieldset" error={errors.satisfaction?.message}>
        <div className="flex flex-wrap gap-1.5">
          {SATISFACTIONS.map(({ value, label }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                value={value}
                className="peer sr-only"
                {...register("satisfaction")}
              />
              <span className="flex h-8 items-center rounded-full bg-[#e9ebfd] px-3 text-xs peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                {label}
              </span>
            </label>
          ))}
        </div>
      </Row>

      <Row label="소비 감정" as="fieldset" error={errors.emotion?.message}>
        <div className="relative flex justify-between">
          <span aria-hidden className="absolute inset-x-3 top-[18px] h-px bg-[#d9dcf8]" />
          {EMOTIONS.map(({ value, label, icon }) => (
            <label key={value} className="relative cursor-pointer">
              <input type="radio" value={value} className="peer sr-only" {...register("emotion")} />
              <span className="flex w-8 flex-col items-center gap-1 rounded-md py-1.5 text-[10px] text-ink/70 peer-checked:bg-primary/70 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                <Image src={icon} alt="" width={22} height={22} className="size-[22px]" />
                {label}
              </span>
            </label>
          ))}
        </div>
      </Row>

      <Row label="한줄메모" htmlFor="memo" error={errors.memo?.message}>
        <input
          id="memo"
          placeholder="오늘의 소비에 대한 기록"
          maxLength={50}
          className={fieldClass}
          {...register("memo")}
        />
      </Row>

      <Row label="거래처" htmlFor="place" error={errors.place?.message}>
        <input
          id="place"
          placeholder="거래처"
          maxLength={30}
          className={fieldClass}
          {...register("place")}
        />
      </Row>

      {error && (
        <p role="alert" className="text-center text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-3">
        등록하기
      </Button>
    </form>
  );
}

const fieldClass =
  "h-10 w-full rounded-lg bg-field px-3 text-[13px] outline-none placeholder:text-muted ring-primary focus:bg-white focus:ring-1 focus:text-primary aria-invalid:ring-1 aria-invalid:ring-danger";

function Row({
  label,
  htmlFor,
  as = "div",
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  as?: "div" | "fieldset";
  error?: string;
  children: ReactNode;
}) {
  const Wrapper = as;
  const labelClass = "w-[60px] shrink-0 pt-2.5 text-[13px] font-semibold";

  return (
    <Wrapper className="flex items-start">
      {as === "fieldset" ? (
        <legend className={cn(labelClass, "float-left")}>{label}</legend>
      ) : (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      )}
      <div className="min-w-0 flex-1">
        {children}
        {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>
    </Wrapper>
  );
}

function PhotoPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputId = useId();

  return (
    <div className="relative h-[72px] overflow-hidden rounded-lg bg-[#eef0fe] ring-1 ring-primary/30 ring-inset">
      {value && (
        <>
          <Image
            src={value}
            alt="선택한 사진"
            fill
            sizes="500px"
            unoptimized={value.startsWith("blob:")}
            className="object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-black/40" />
        </>
      )}
      {/* TODO: 사진 업로드 API가 생기면 서버에 올리고 받은 주소를 저장. 지금은 기기 안에서만 보이는 임시 주소 */}
      <label
        htmlFor={inputId}
        className={cn(
          "absolute inset-0 flex cursor-pointer items-center justify-center gap-1 text-[13px] font-medium",
          value ? "text-white" : "text-primary",
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        사진 업로드
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}
