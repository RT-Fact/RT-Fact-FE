import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

import { postAuthToken } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";

export const useAuthTokenQuery = (code: string | null) => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.actions.setSession);

  const query = useQuery({
    queryKey: ["authToken", code],
    queryFn: () => {
      if (!code) {
        throw new Error("No code received");
      }
      return postAuthToken(code);
    },
    enabled: !!code,
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
    if (query.isError) {
      console.error("OAuth callback failed:", query.error);
      void navigate("/login");
    }
  }, [query.isError, query.error, navigate]);

  useEffect(() => {
    if (!code) {
      console.error("No auth code in URL");
      void navigate("/login");
    }
  }, [code, navigate]);

  return query;
};
