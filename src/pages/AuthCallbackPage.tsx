import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useAuthTokenMutation } from "@/hooks/mutations/useAuthMutations";
import { useAuthStore } from "@/stores/authStore";

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const { mutate: exchangeToken } = useAuthTokenMutation();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      console.error("OAuth callback: No code received");
      void navigate("/login");
      return;
    }

    exchangeToken(code, {
      onSuccess: (data) => {
        setSession({
          accessToken: data.accessToken,
          isGuest: false,
        });
        void navigate("/");
      },
      onError: (error) => {
        console.error("Token exchange failed:", error);
        void navigate("/login");
      },
    });
  }, [searchParams, navigate, setSession, exchangeToken]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto" />
        <p className="text-gray-600">로그인 중...</p>
      </div>
    </div>
  );
};
