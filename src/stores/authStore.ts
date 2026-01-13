import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isGuest: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsGuest: (isGuest: boolean, remainingUses?: number) => void;
  setSession: (data: {
    accessToken: string;
    isGuest: boolean;
    remainingUses?: number | null;
    user?: User | null;
  }) => void;
  logout: () => void;

  remainingUses: number | null;
  decrementRemainingUses: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isGuest: true,
      remainingUses: null,

      setAccessToken: (token) => {
        set({
          accessToken: token,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setIsGuest: (isGuest, remainingUses) => {
        set({
          isGuest,
          remainingUses: isGuest ? (remainingUses ?? 3) : null,
        });
      },

      setSession: (data) => {
        set({
          accessToken: data.accessToken,
          isGuest: data.isGuest,
          remainingUses: data.isGuest ? (data.remainingUses ?? 3) : null,
          user: data.user || get().user,
        });
      },

      decrementRemainingUses: () => {
        const { remainingUses } = get();
        if (remainingUses !== null && remainingUses > 0) {
          set({ remainingUses: remainingUses - 1 });
        }
      },

      logout: () => {
        set({
          accessToken: null,
          isGuest: true,
        });
        window.location.href = "/";
      },
    }),
    {
      name: "auth-status",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isGuest: state.isGuest,
        remainingUses: state.remainingUses,
      }),
    },
  ),
);
