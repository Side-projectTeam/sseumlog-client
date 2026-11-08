import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  likedIds: number[];
  setLiked: (id: number, liked: boolean) => void;
};

// TODO: 서버에 좋아요 API가 생기면 교체. 지금은 이 기기에만 저장한다.
export const useLikeStore = create<State>()(
  persist(
    (set) => ({
      likedIds: [],
      setLiked: (id, liked) =>
        set(({ likedIds }) => ({
          likedIds: liked ? [...new Set([...likedIds, id])] : likedIds.filter((v) => v !== id),
        })),
    }),
    { name: "sseumlog-likes", storage: createJSONStorage(() => localStorage) },
  ),
);
