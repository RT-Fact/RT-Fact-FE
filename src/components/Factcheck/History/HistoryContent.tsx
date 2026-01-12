import { useState } from "react";

// TODO(API): 실제 API 연동 시 mock import 삭제
import { mockHistoryItems, mockHistoryPagination } from "@/mocks/historyMock";

import HistoryCard from "./HistoryCard";
import HistoryList from "./HistoryList";

interface HistoryContentProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const HistoryContent = ({ selectedId, onSelect }: HistoryContentProps) => {
  const [page, setPage] = useState(1);

  const handleSelect = (id: string) => {
    onSelect(id);
    // TODO(API): 선택 시 팩트체크 데이터 로드 구현 후 console.log 삭제
    console.log("Selected history:", id);
  };

  const handleDelete = (id: string) => {
    // TODO(API): 삭제 API 호출 구현 후 console.log 삭제
    console.log("Delete history:", id);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // TODO(API): 페이지 데이터 fetch 구현 후 console.log 삭제
    console.log("Page changed to:", newPage);
  };

  // TODO(API): 실제 API 연동 시 아래 Mock 처리 로직 삭제
  const limit = mockHistoryPagination.limit;
  const offset = (page - 1) * limit;
  const currentItems = mockHistoryItems.slice(offset, offset + limit);

  // TODO(API): pagination은 API 응답으로 대체
  return (
    <HistoryList
      pagination={{
        ...mockHistoryPagination,
        page,
        total: mockHistoryItems.length,
        totalPages: Math.ceil(mockHistoryItems.length / limit),
      }}
      onPageChange={handlePageChange}
    >
      {currentItems.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      ))}
    </HistoryList>
  );
};

export default HistoryContent;
