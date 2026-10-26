import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type Props = {
  nickname: string;
  onCreate: () => void;
  onUseExisting: () => void;
  onClose: () => void;
};

export function DecorateSheet({ nickname, onCreate, onUseExisting, onClose }: Props) {
  return (
    <BottomSheet
      title="소비방 꾸미기"
      description={`${nickname}님의 소비를 간단히 기록해봐요!`}
      titleAlign="center"
      onClose={onClose}
    >
      <div className="flex flex-col gap-2.5 pt-2">
        <Button size="md" onClick={onCreate}>
          새 소비 기록 등록하기
        </Button>
        <Button size="md" variant="outline" onClick={onUseExisting}>
          기존 소비 기록 사용하기
        </Button>
      </div>
    </BottomSheet>
  );
}
