import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import { useDeleteFactCheckMutation } from "@/hooks/mutations/useFactCheckMutations";
import { factcheckQueries } from "@/queries/factcheckQueries";

import HistoryCard from "./HistoryCard";
import HistoryList from "./HistoryList";

interface HistoryContentProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const HistoryContent = ({ selectedId, onSelect }: HistoryContentProps) => {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch } = useQuery(
    factcheckQueries.list({ page, limit: DEFAULT_PAGE_LIMIT }),
  );
  const { mutate: deleteFactCheck } = useDeleteFactCheckMutation();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">히스토리를 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">히스토리를 불러올 수 없습니다.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteFactCheck(id);
  };

  return (
    <HistoryList pagination={data.pagination} onPageChange={setPage}>
      {data.items.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          onDelete={handleDelete}
        />
      ))}
    </HistoryList>
  );
};

export default HistoryContent;
