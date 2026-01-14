import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_GUEST_USAGE,
  DEFAULT_GUEST_USAGE_DECREMENT,
  DEFAULT_GUEST_USAGE_END,
} from "@/constants/guest";

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isGuest: boolean;
  remainingUses: number | null;

  actions: {
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
    decrementRemainingUses: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isGuest: true,
      remainingUses: null,

      actions: {
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
            remainingUses: isGuest ? (remainingUses ?? DEFAULT_GUEST_USAGE) : null,
          });
        },

        setSession: (data) => {
          set({
            accessToken: data.accessToken,
            isGuest: data.isGuest,
            remainingUses: data.isGuest ? (data.remainingUses ?? DEFAULT_GUEST_USAGE) : null,
            user: data.user || get().user,
          });
        },

        decrementRemainingUses: () => {
          const { remainingUses } = get();
          if (remainingUses !== null && remainingUses > DEFAULT_GUEST_USAGE_END) {
            set({ remainingUses: remainingUses - DEFAULT_GUEST_USAGE_DECREMENT });
          }
        },

        logout: () => {
          set({
            accessToken: null,
            isGuest: true,
          });
          window.location.href = "/";
        },
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
