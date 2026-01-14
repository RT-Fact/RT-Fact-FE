import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { postAuthToken } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";

export const useAuthTokenQuery = (code: string | null) => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.actions.setSession);

  const query = useQuery({
    queryKey: ["authToken", code],
    queryFn: () => {
      if (!code) {
        throw new Error("No code received");
      }
      return postAuthToken(code);
    },
    enabled: !!code && !accessToken,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setSession({
        accessToken: query.data.accessToken,
        isGuest: false,
      });
      void navigate("/");
    }
  }, [query.isSuccess, query.data, setSession, navigate]);

  useEffect(() => {
    if (query.isError || !code) {
      console.error("OAuth callback failed");
      void navigate("/login");
    }
  }, [query.isError, code, navigate]);

  return query;
};
