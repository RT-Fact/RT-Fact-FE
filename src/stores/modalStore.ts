import { create } from "zustand";

interface ModalState {
  isGuestLimitModalOpen: boolean;
  setGuestLimitModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isGuestLimitModalOpen: false,
  setGuestLimitModalOpen: (open) => set({ isGuestLimitModalOpen: open }),
}));
