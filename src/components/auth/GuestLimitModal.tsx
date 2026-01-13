import { useNavigate } from "react-router";

import * as Dialog from "@radix-ui/react-dialog";
import { LogIn, X } from "lucide-react";

interface GuestLimitModalProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const GuestLimitModal = ({ isOpen, onOpenChange }: GuestLimitModalProps) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onOpenChange?.(false);
    void navigate("/login");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Content */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              게스트 이용 횟수 소진
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              무료 게스트 이용 횟수를 모두 사용하셨습니다.
              <br />
              계속 이용하시려면 로그인해 주세요.
            </Dialog.Description>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              로그인하러 가기
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                닫기
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GuestLimitModal;
