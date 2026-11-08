import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  /** 회원정보 수정에 쓰는 재인증 토큰. 카카오 재인증은 페이지를 떠났다 오므로 탭 세션에 둔다. */
  reauthToken: string | null;
  setReauthToken: (token: string | null) => void;
};

export const useReauthStore = create<State>()(
  persist(
    (set) => ({
      reauthToken: null,
      setReauthToken: (reauthToken) => set({ reauthToken }),
    }),
    { name: "sseumlog-reauth", storage: createJSONStorage(() => sessionStorage) },
  ),
);
