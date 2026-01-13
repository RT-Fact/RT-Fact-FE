import { useEffect } from "react";
import { Outlet } from "react-router";

import GuestLimitModal from "@/components/auth/GuestLimitModal";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useGuestLoginMutation, useRefreshTokenMutation } from "@/hooks/mutations/useAuthMutations";
import { useAuthStore } from "@/stores/authStore";

export const MainLayout = () => {
  const { isGuest, remainingUses, accessToken, setSession } = useAuthStore();
  const showGuestLimit = isGuest && remainingUses !== null && remainingUses <= 0;

  const { mutateAsync: refreshToken } = useRefreshTokenMutation();
  const { mutateAsync: loginAsGuest } = useGuestLoginMutation();

  useEffect(() => {
    if (accessToken) return;

    const initSession = async () => {
      if (isGuest) {
        // 게스트 상태: /auth/guest 호출
        try {
          const { accessToken, isGuest, remainingUses } = await loginAsGuest();
          setSession({
            accessToken,
            isGuest,
            remainingUses,
          });
        } catch (error) {
          console.warn("Guest login failed:", error);
        }
      } else {
        // 로그인 유저: /auth/refresh 호출
        try {
          const { accessToken } = await refreshToken();
          setSession({
            accessToken,
            isGuest: false,
          });
        } catch {
          // refresh 실패 시 게스트로 폴백
          try {
            const { accessToken, isGuest, remainingUses } = await loginAsGuest();
            setSession({
              accessToken,
              isGuest,
              remainingUses,
            });
          } catch (error) {
            console.warn("Session init failed:", error);
          }
        }
      }
    };

    void initSession();
  }, [accessToken, isGuest, setSession, refreshToken, loginAsGuest]);

  if (!accessToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
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
      <GuestLimitModal isOpen={showGuestLimit} />
    </div>
  );
};
