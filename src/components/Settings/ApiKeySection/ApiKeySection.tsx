import { Check, Copy, Key, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { ApiKey } from "@/types/apiKey";
import { formatAbsoluteDate } from "@/utils/formatDate";

import { CreateApiKeyModal } from "./CreateApiKeyModal";

const MAX_API_KEYS = 5;

interface ApiKeySectionProps {
  mcpServerUrl: string;
  apiKeys: ApiKey[];
  onDeleteKey: (id: string) => void;
  isDeleting?: boolean;
}

export const ApiKeySection = ({
  mcpServerUrl,
  apiKeys,
  onDeleteKey,
  isDeleting = false,
}: ApiKeySectionProps) => {
  const { copied: copiedUrl, copy: copyUrl } = useCopyToClipboard();
  const isLimitReached = apiKeys.length >= MAX_API_KEYS;

  return (
    <Card className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Key className="size-5 text-blue-600" />
        <h2 className="text-lg font-semibold">API Key 관리</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        MCP 서버 연동을 위한 API Key를 관리합니다. 생성된 키는 최초 1회만 확인할 수 있습니다.
      </p>

      {/* MCP Server URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">MCP Server URL</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-md border bg-muted/50 px-3 py-2 font-mono text-sm">
            {mcpServerUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => void copyUrl(mcpServerUrl)}
          >
            {copiedUrl ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            {copiedUrl ? "복사됨" : "복사"}
          </Button>
        </div>
      </div>

      {/* API Key List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-medium">등록된 API Keys</label>
            {isLimitReached && (
              <p className="text-xs text-muted-foreground">
                최대 {MAX_API_KEYS}개까지 생성 가능합니다
              </p>
            )}
          </div>
          <CreateApiKeyModal
            trigger={
              <Button size="sm" className="gap-1.5" disabled={isLimitReached}>
                <Plus className="size-4" />새 API Key
              </Button>
            }
          />
        </div>

        {apiKeys.length === 0 ? (
          <div className="rounded-md border border-dashed py-8 text-center">
            <p className="text-sm text-muted-foreground">등록된 API Key가 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{apiKey.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                      {apiKey.prefix}...
                    </code>
                    <span>·</span>
                    <span>{formatAbsoluteDate(apiKey.createdAt)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteKey(apiKey.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
