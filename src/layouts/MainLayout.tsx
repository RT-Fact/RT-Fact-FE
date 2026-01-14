import { Outlet, useNavigate } from "react-router";

import { LogIn } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useSessionQuery } from "@/hooks/queries/useSessionQuery";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";

export const MainLayout = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isGuestLimitModalOpen = useModalStore((state) => state.isGuestLimitModalOpen);
  const setGuestLimitModalOpen = useModalStore((state) => state.setGuestLimitModalOpen);
  const { isLoading, isError } = useSessionQuery();

  const handleLoginRedirect = () => {
    setGuestLimitModalOpen(false);
    void navigate("/login");
  };

  if (isLoading || !accessToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">세션 초기화 실패</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground antialiased">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
      <Modal open={isGuestLimitModalOpen} onOpenChange={setGuestLimitModalOpen}>
        <ModalContent size="md">
          <ModalClose />
          <ModalHeader icon={<LogIn className="h-6 w-6 text-blue-600" />}>
            <ModalTitle>게스트 이용 횟수 소진</ModalTitle>
            <ModalDescription>
              무료 게스트 이용 횟수를 모두 사용하셨습니다.
              <br />
              계속 이용하시려면 로그인해 주세요.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button onClick={handleLoginRedirect} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              로그인하러 가기
            </Button>
            <ModalClose asChild>
              <Button variant="outline" className="w-full">
                닫기
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
