import { type ReactNode } from "react";

type Props = {
  title: string;
  description: ReactNode;
  children: ReactNode;
};

export function ResultCard({ title, description, children }: Props) {
  return (
    <section className="-mx-2 mt-2 flex flex-col rounded-xl bg-white px-3 pt-6 pb-4">
      <h2 className="text-center text-xl font-bold text-primary">{title}</h2>
      {/* TODO: 일러스트가 나오면 교체 */}
      <div aria-hidden className="mx-auto mt-5 size-[100px] rounded-full bg-[#d9d9d9]" />
      <p className="mt-6 text-center text-sm leading-[1.6]">{description}</p>
      {children}
    </section>
  );
}
