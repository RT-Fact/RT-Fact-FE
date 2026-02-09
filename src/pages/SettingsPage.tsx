import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiKeySection } from "@/components/Settings/ApiKeySection/ApiKeySection";
import DomainListEditor from "@/components/Settings/DomainListEditor";
import { Button } from "@/components/ui/button";
import { useDeleteApiKeyMutation } from "@/hooks/mutations/useApiKeyMutations";
import {
  useAddBlacklistMutation,
  useAddWhitelistMutation,
  useRemoveBlacklistMutation,
  useRemoveWhitelistMutation,
} from "@/hooks/mutations/useSettingsMutations";
import { apiKeyQueries } from "@/queries/apiKeyQueries";
import { settingsQueries } from "@/queries/settingsQueries";

// TODO: 백엔드 API 연동 시 실제 환경변수로 교체
const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL ?? "https://mcp.rt-fact.com";

export const SettingsPage = () => {
  const {
    data: settings,
    isPending: isSettingsPending,
    isError: isSettingsError,
    refetch,
  } = useQuery(settingsQueries.detail());
  const { data: apiKeys, isPending: isApiKeysPending } = useQuery(apiKeyQueries.list());

  const addWhitelist = useAddWhitelistMutation();
  const removeWhitelist = useRemoveWhitelistMutation();
  const addBlacklist = useAddBlacklistMutation();
  const removeBlacklist = useRemoveBlacklistMutation();
  const deleteApiKey = useDeleteApiKeyMutation();

  const handleAddWhitelist = (domain: string) => {
    addWhitelist.mutate(domain, {
      onSuccess: () => toast.success("신뢰할 수 있는 사이트에 추가되었습니다"),
      onError: () => toast.error("도메인 추가에 실패했습니다"),
    });
  };

  const handleRemoveWhitelist = (domain: string) => {
    removeWhitelist.mutate(domain, {
      onSuccess: () => toast.success("신뢰할 수 있는 사이트에서 삭제되었습니다"),
      onError: () => toast.error("도메인 삭제에 실패했습니다"),
    });
  };

  const handleAddBlacklist = (domain: string) => {
    addBlacklist.mutate(domain, {
      onSuccess: () => toast.success("제외할 사이트에 추가되었습니다"),
      onError: () => toast.error("도메인 추가에 실패했습니다"),
    });
  };

  const handleRemoveBlacklist = (domain: string) => {
    removeBlacklist.mutate(domain, {
      onSuccess: () => toast.success("제외할 사이트에서 삭제되었습니다"),
      onError: () => toast.error("도메인 삭제에 실패했습니다"),
    });
  };

  const handleDeleteApiKey = (id: string) => {
    deleteApiKey.mutate(id, {
      onSuccess: () => {
        toast.success("API Key가 삭제되었습니다");
      },
      onError: () => toast.error("API Key 삭제에 실패했습니다"),
    });
  };

  if (isSettingsPending || isApiKeysPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">설정을 불러오는 중...</p>
      </div>
    );
  }

  if (isSettingsError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">설정을 불러올 수 없습니다.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="mt-1 text-muted-foreground">팩트체크 검증에 사용할 출처를 관리합니다.</p>
        </div>

        <div className="flex flex-col gap-6">
          <ApiKeySection
            mcpServerUrl={MCP_SERVER_URL}
            apiKeys={apiKeys ?? []}
            onDeleteKey={handleDeleteApiKey}
            isDeleting={deleteApiKey.isPending}
          />

          <DomainListEditor
            title="신뢰할 수 있는 사이트"
            description="이 목록의 사이트는 팩트체크 검증 시 신뢰할 수 있는 출처로 우선 사용됩니다."
            variant="whitelist"
            domains={settings?.whitelist ?? []}
            onAdd={handleAddWhitelist}
            onRemove={handleRemoveWhitelist}
            isPending={addWhitelist.isPending || removeWhitelist.isPending}
          />

          <DomainListEditor
            title="제외할 사이트"
            description="이 목록의 사이트는 팩트체크 검증 시 출처로 사용되지 않습니다."
            variant="blacklist"
            domains={settings?.blacklist ?? []}
            onAdd={handleAddBlacklist}
            onRemove={handleRemoveBlacklist}
            isPending={addBlacklist.isPending || removeBlacklist.isPending}
          />
        </div>
      </div>
    </div>
  );
};
