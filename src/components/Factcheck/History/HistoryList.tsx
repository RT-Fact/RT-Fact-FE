import { Children, type ReactNode } from "react";

import { DEFAULT_PAGE_GROUP_SIZE } from "@/constants/pagination";
import type { Pagination } from "@/types/factcheck";

import HistoryEmptyState from "./HistoryEmptyState";
import HistoryPagination from "./HistoryPagination";

interface HistoryListProps {
  children: ReactNode;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

const HistoryList = ({ children, pagination, onPageChange }: HistoryListProps) => {
  if (Children.count(children) === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-2 p-4">{children}</ul>
      <HistoryPagination
        pagination={pagination}
        onPageChange={onPageChange}
        pageGroupSize={DEFAULT_PAGE_GROUP_SIZE}
      />
    </div>
  );
};

export default HistoryList;
