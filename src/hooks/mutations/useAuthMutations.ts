import { useMutation } from "@tanstack/react-query";

import { postLogout } from "@/api/authApi";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: postLogout,
  });
};
