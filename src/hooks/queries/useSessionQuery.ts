import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { postGuestLogin, postRefreshToken } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";

export const useSessionQuery = () => {
  const { isGuest, accessToken, setSession } = useAuthStore(
    useShallow((state) => ({
      isGuest: state.isGuest,
      accessToken: state.accessToken,
      setSession: state.actions.setSession,
    })),
  );

  const query = useQuery({
    queryKey: ["session", isGuest],
    queryFn: async () => {
      if (isGuest) {
        const result = await postGuestLogin();
        return { ...result, type: "guest" as const };
      }

      try {
        const result = await postRefreshToken();
        return { ...result, type: "refresh" as const };
      } catch {
        const fallback = await postGuestLogin();
        return { ...fallback, type: "guest" as const };
      }
    },
    enabled: !accessToken,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data && !accessToken) {
      if (query.data.type === "guest") {
        setSession({
          accessToken: query.data.accessToken,
          isGuest: query.data.isGuest,
          remainingUses: query.data.remainingUses,
        });
      } else {
        setSession({
          accessToken: query.data.accessToken,
          isGuest: false,
        });
      }
    }
  }, [query.data, accessToken, setSession]);

  return query;
};
