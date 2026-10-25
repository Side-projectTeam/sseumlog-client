import { BottomNav } from "@/components/navigation/bottom-nav";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    // 모바일 앱 화면이라 넓은 화면에서는 가운데 한 열로 보여준다.
    <div className="min-h-dvh bg-field">
      <div className="mx-auto flex min-h-dvh max-w-[500px] flex-col bg-room">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
