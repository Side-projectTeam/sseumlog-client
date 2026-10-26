"use client";

import type { CategoryId } from "@/features/home/types";

import { DecorateSheet } from "./decorate-sheet";
import { RecordDetailSheet } from "./record-detail-sheet";
import { CreateRecordSheet, EditRecordSheet } from "./record-form-sheet";
import { RecordListSheet } from "./record-list-sheet";

export type SheetRoute =
  | { type: "decorate" }
  | { type: "list"; category?: CategoryId }
  | { type: "create"; category?: CategoryId }
  | { type: "detail"; id: number }
  | { type: "edit"; id: number };

type Props = {
  nickname: string;
  /** 열린 시트들. 맨 마지막 것만 보여주고, 닫거나 완료하면 이전 시트로 돌아간다. */
  stack: SheetRoute[];
  onChange: (stack: SheetRoute[]) => void;
};

export function RecordSheets({ nickname, stack, onChange }: Props) {
  const current = stack.at(-1);
  if (!current) return null;

  const push = (route: SheetRoute) => onChange([...stack, route]);
  const pop = () => onChange(stack.slice(0, -1));
  const replace = (route: SheetRoute) => onChange([...stack.slice(0, -1), route]);
  const closeAll = () => onChange([]);

  switch (current.type) {
    case "decorate":
      return (
        <DecorateSheet
          nickname={nickname}
          onCreate={() => replace({ type: "create" })}
          onUseExisting={() => replace({ type: "list" })}
          onClose={closeAll}
        />
      );
    case "list":
      return (
        <RecordListSheet
          nickname={nickname}
          category={current.category}
          onCreate={() => push({ type: "create", category: current.category })}
          onSelect={(id) => push({ type: "detail", id })}
          onClose={closeAll}
        />
      );
    case "create":
      return <CreateRecordSheet category={current.category} onDone={pop} onClose={closeAll} />;
    case "detail":
      return (
        <RecordDetailSheet
          id={current.id}
          onEdit={() => push({ type: "edit", id: current.id })}
          onDeleted={pop}
          onClose={closeAll}
        />
      );
    case "edit":
      return <EditRecordSheet id={current.id} onDone={pop} onClose={closeAll} />;
  }
}
