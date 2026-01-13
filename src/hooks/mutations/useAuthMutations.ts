import { useMutation } from "@tanstack/react-query";

import { postAuthToken, postGuestLogin, postLogout, postRefreshToken } from "@/api/authApi";

export const useAuthTokenMutation = () => {
  return useMutation({
    mutationFn: postAuthToken,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: postLogout,
  });
};

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: postGuestLogin,
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: postRefreshToken,
  });
};
