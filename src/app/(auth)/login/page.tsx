import Image from "next/image";

import { LoginForm } from "./_components/login-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | 쓸로그",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-primary lg:flex-row">
      <section className="relative flex flex-1 flex-col px-5 pt-[calc(env(safe-area-inset-top)+15px)] lg:justify-center lg:px-20 lg:py-16">
        {/* TODO: 로고 이미지로 교체 */}
        <span className="flex size-[23px] items-center justify-center bg-[#d9d9d9] text-[5px] font-bold text-ink lg:absolute lg:top-10 lg:left-20 lg:size-9 lg:text-[8px]">
          쓸로그
        </span>
        <h1 className="mt-[30px] text-[22px] leading-[1.4] font-bold text-white lg:mt-0 lg:text-5xl lg:leading-[1.3]">
          내 소비를 기록하고
          <br />
          좋은 소비를 발견해요
        </h1>
        {/* TODO: 시안 캡쳐에서 잘라낸 임시 이미지. 원본 에셋으로 교체 */}
        <Image
          src="/images/pig.png"
          width={280}
          height={245}
          alt=""
          priority
          className="mt-auto mb-6 w-[175px] self-end lg:mt-16 lg:mb-0 lg:w-[340px] lg:self-start"
        />
      </section>

      <section className="rounded-t-[20px] bg-white px-5 pt-9 pb-[calc(env(safe-area-inset-bottom)+16px)] lg:flex lg:w-[520px] lg:items-center lg:justify-center lg:rounded-none lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-[400px]">
          <h2 className="mb-10 hidden text-3xl font-bold lg:block">로그인</h2>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
