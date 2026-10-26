import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Session = {
  userId: number;
  email: string;
  accessToken: string;
};

type AuthState = {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

// 서버가 토큰을 응답 body로만 주고 refresh 토큰이 없어서, 로그인 상태를 localStorage에 둔다.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    { name: "sseumlog-auth", storage: createJSONStorage(() => localStorage) },
  ),
);
