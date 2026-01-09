import type { FactCheckResponse } from "@/types/factcheck";

import { apiClient } from "./client";

export const postFactCheck = async (text: string): Promise<FactCheckResponse> => {
  const { data } = await apiClient.post<FactCheckResponse>("/factcheck", { text });
  return data;
};
