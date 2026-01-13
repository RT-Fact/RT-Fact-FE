import { useState } from "react";

import { CheckCircle2, Plus, X, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DomainListEditorProps {
  title: string;
  description: string;
  variant: "whitelist" | "blacklist";
  domains: string[];
  onAdd: (domain: string) => void;
  onRemove: (domain: string) => void;
  isPending?: boolean;
}

const variantConfig = {
  whitelist: {
    icon: CheckCircle2,
    iconColor: "text-(--verdict-true)",
  },
  blacklist: {
    icon: XCircle,
    iconColor: "text-(--verdict-false)",
  },
};

const DomainListEditor = ({
  title,
  description,
  variant,
  domains,
  onAdd,
  onRemove,
  isPending = false,
}: DomainListEditorProps) => {
  const [inputValue, setInputValue] = useState("");
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleAdd = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !domains.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon className={cn("size-5", config.iconColor)} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Domain List */}
      <div className="flex flex-col gap-2">
        {domains.map((domain) => (
          <div
            key={domain}
            className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
          >
            <span className="text-sm">{domain}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(domain)}
              disabled={isPending}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Domain Input */}
      <div className="flex gap-2">
        <Input
          placeholder="도메인 입력 (예: example.com)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={isPending || !inputValue.trim()} className="gap-1.5">
          <Plus className="size-4" />
          추가
        </Button>
      </div>
    </Card>
  );
};

export default DomainListEditor;
