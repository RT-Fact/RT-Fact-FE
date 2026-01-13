import { useQuery } from "@tanstack/react-query";

import DomainListEditor from "@/components/Settings/DomainListEditor";
import {
  useAddBlacklistMutation,
  useAddWhitelistMutation,
  useRemoveBlacklistMutation,
  useRemoveWhitelistMutation,
} from "@/hooks/mutations/useSettingsMutations";
import { settingsQueries } from "@/queries/settingsQueries";

export const SettingsPage = () => {
  const { data: settings, isPending } = useQuery(settingsQueries.detail());

  const addWhitelist = useAddWhitelistMutation();
  const removeWhitelist = useRemoveWhitelistMutation();
  const addBlacklist = useAddBlacklistMutation();
  const removeBlacklist = useRemoveBlacklistMutation();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
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
          onAdd={(domain) => addWhitelist.mutate(domain)}
          onRemove={(domain) => removeWhitelist.mutate(domain)}
          isPending={addWhitelist.isPending || removeWhitelist.isPending}
        />

        <DomainListEditor
          title="제외할 사이트"
          description="이 목록의 사이트는 팩트체크 검증 시 출처로 사용되지 않습니다."
          variant="blacklist"
          domains={settings?.blacklist ?? []}
          onAdd={(domain) => addBlacklist.mutate(domain)}
          onRemove={(domain) => removeBlacklist.mutate(domain)}
          isPending={addBlacklist.isPending || removeBlacklist.isPending}
        />
      </div>
    </div>
  );
};
