import { useMutation } from "@tanstack/react-query";

import { postFactCheck } from "@/api/factcheckApi";

export const useFactCheckMutation = () => {
  return useMutation({
    mutationFn: postFactCheck,
  });
};
