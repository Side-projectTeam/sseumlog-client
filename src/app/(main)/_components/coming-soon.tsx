export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="bg-primary px-5 pt-[env(safe-area-inset-top)] text-white">
        <h1 className="flex h-12 items-center text-xl font-bold">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-base font-semibold">준비 중인 화면이에요</p>
        <p className="text-sm text-muted">조금만 기다려 주세요!</p>
      </div>
    </main>
  );
}
