import { PrimaryButton } from "./primary-button";

type Props = {
  message: string;
  onClose: () => void;
};

// 시안에서 알림 창은 화면 가운데가 아니라 폼 버튼 바로 아래에 뜬다.
export function AlertDialog({ message, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 px-5 pt-[calc(env(safe-area-inset-top)+250px)]">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-message"
        className="mx-auto w-full max-w-[400px] rounded-lg bg-white p-3"
      >
        <p id="alert-dialog-message" className="py-3 text-sm text-ink/80">
          {message}
        </p>
        <PrimaryButton type="button" autoFocus onClick={onClose} className="mt-2 w-full">
          확인
        </PrimaryButton>
      </div>
    </div>
  );
}
