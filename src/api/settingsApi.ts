import type { SettingsResponse } from "@/types/settings";

import { apiClient } from "./client";

export const getSettings = async (): Promise<SettingsResponse> => {
  const response = await apiClient.get<SettingsResponse>("/settings");
  return response.data;
};

export const addWhitelistDomain = async (domain: string): Promise<void> => {
  await apiClient.post("/settings/whitelist", { domain });
};

export const removeWhitelistDomain = async (domain: string): Promise<void> => {
  await apiClient.delete(`/settings/whitelist/${encodeURIComponent(domain)}`);
};

export const addBlacklistDomain = async (domain: string): Promise<void> => {
  await apiClient.post("/settings/blacklist", { domain });
};

export const removeBlacklistDomain = async (domain: string): Promise<void> => {
  await apiClient.delete(`/settings/blacklist/${encodeURIComponent(domain)}`);
};
