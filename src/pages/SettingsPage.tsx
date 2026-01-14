import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import DomainListEditor from "@/components/Settings/DomainListEditor";
import { Button } from "@/components/ui/button";
import {
  useAddBlacklistMutation,
  useAddWhitelistMutation,
  useRemoveBlacklistMutation,
  useRemoveWhitelistMutation,
} from "@/hooks/mutations/useSettingsMutations";
import { settingsQueries } from "@/queries/settingsQueries";

export const SettingsPage = () => {
  const { data: settings, isPending, isError, refetch } = useQuery(settingsQueries.detail());

  const addWhitelist = useAddWhitelistMutation();
  const removeWhitelist = useRemoveWhitelistMutation();
  const addBlacklist = useAddBlacklistMutation();
  const removeBlacklist = useRemoveBlacklistMutation();

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

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">설정을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="mt-1 text-muted-foreground">팩트체크 검증에 사용할 출처를 관리합니다.</p>
        </div>

        {/* Domain List Sections */}
        <div className="flex flex-col gap-6">
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
