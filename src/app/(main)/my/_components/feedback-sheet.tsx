"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useSendFeedback } from "@/features/user/queries";
import { feedbackSchema, type FeedbackForm } from "@/features/user/schemas";
import { getApiErrorMessage } from "@/lib/api/client";

const MAX_LENGTH = 500;

// TODO: 피드백 화면 시안이 나오면 맞추기
export function FeedbackSheet({ onClose }: { onClose: () => void }) {
  const sendMutation = useSendFeedback();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { content: "" },
  });
  const length = useWatch({ control, name: "content" }).length;

  const submit = handleSubmit(({ content }) => sendMutation.mutate(content));

  return (
    <BottomSheet
      title="피드백 보내기"
      description="쓸로그를 쓰면서 불편했던 점이나 바라는 점을 알려주세요."
      onClose={onClose}
    >
      {sendMutation.isSuccess ? (
        <div className="flex flex-col items-center gap-5 pt-4">
          <p className="text-sm">소중한 의견 고마워요!</p>
          <Button onClick={onClose} className="w-full rounded-xl">
            닫기
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              aria-label="피드백 내용"
              rows={6}
              maxLength={MAX_LENGTH}
              placeholder="내용을 입력해 주세요."
              aria-invalid={!!errors.content}
              className="w-full resize-none rounded-lg bg-field p-4 pb-7 text-sm ring-primary outline-none placeholder:text-[#b5b5b5] focus:ring-1 aria-invalid:ring-1 aria-invalid:ring-danger"
              {...register("content")}
            />
            <span className="absolute right-3 bottom-3 text-[11px] text-muted tabular-nums">
              {length}/{MAX_LENGTH}
            </span>
          </div>
          {(errors.content || sendMutation.isError) && (
            <p role="alert" className="text-[11px] text-danger">
              {errors.content?.message ?? getApiErrorMessage(sendMutation.error)}
            </p>
          )}
          <Button type="submit" disabled={sendMutation.isPending} className="w-full rounded-xl">
            보내기
          </Button>
        </form>
      )}
    </BottomSheet>
  );
}
