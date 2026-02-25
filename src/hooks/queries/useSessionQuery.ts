import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/shallow";

import { refreshAuthToken, refreshGuestToken } from "@/api/client";
import { useAuthStore } from "@/stores/authStore";

export const useSessionQuery = () => {
  const { isGuest, accessToken } = useAuthStore(
    useShallow((state) => ({
      isGuest: state.isGuest,
      accessToken: state.accessToken,
    })),
  );

  return useQuery({
    queryKey: ["session", isGuest],
    queryFn: async () => {
      if (isGuest) {
        await refreshGuestToken();
        return;
      }

      try {
        await refreshAuthToken();
      } catch (error) {
        // 인증 에러(401/403)만 게스트 전환, 나머지(네트워크/서버 오류)는 전파
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          await refreshGuestToken();
          return;
        }
        throw error;
      }
    },
    enabled: !accessToken,
    retry: true,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
