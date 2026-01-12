import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { Pagination as PaginationType } from "@/types/factcheck";

const getPageGroup = (currentPage: number, totalPages: number, groupSize: number): number[] => {
  const groupIndex = Math.floor((currentPage - 1) / groupSize);
  const start = groupIndex * groupSize + 1;
  const end = Math.min(start + groupSize - 1, totalPages);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const buildPaginationState = (page: number, totalPages: number, pageGroupSize: number) => {
  const pageItems = getPageGroup(page, totalPages, pageGroupSize);
  const currentGroupStart = pageItems[0];
  const currentGroupEnd = pageItems[pageItems.length - 1] ?? currentGroupStart;

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const isFirstGroup = currentGroupStart === 1;
  const isLastGroup = currentGroupEnd === totalPages;

  const prevGroupFirstPage = Math.max(1, currentGroupStart - pageGroupSize);
  const nextGroupFirstPage = Math.min(totalPages, currentGroupEnd + 1);

  return {
    pageItems,
    isFirstPage,
    isLastPage,
    isFirstGroup,
    isLastGroup,
    prevGroupFirstPage,
    nextGroupFirstPage,
  };
};

interface HistoryPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  pageGroupSize: number;
}

const HistoryPagination = ({ pagination, onPageChange, pageGroupSize }: HistoryPaginationProps) => {
  const { page, totalPages } = pagination;

  if (!totalPages || totalPages <= 1) return null;

  const {
    pageItems,
    isFirstPage,
    isLastPage,
    isFirstGroup,
    isLastGroup,
    prevGroupFirstPage,
    nextGroupFirstPage,
  } = buildPaginationState(page, totalPages, pageGroupSize);

  const disabledClass = "pointer-events-none opacity-50";
  const navClass = (disabled: boolean) => cn("cursor-pointer", disabled && disabledClass);
  const handleNavClick = (targetPage: number, disabled: boolean) => () => {
    if (disabled) return;
    onPageChange(targetPage);
  };

  return (
    <Pagination className="py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            onClick={handleNavClick(1, isFirstPage)}
            className={navClass(isFirstPage)}
            aria-disabled={isFirstPage}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            onClick={handleNavClick(prevGroupFirstPage, isFirstGroup)}
            className={navClass(isFirstGroup)}
            aria-disabled={isFirstGroup}
          />
        </PaginationItem>

        {pageItems.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              onClick={() => onPageChange(item)}
              isActive={page === item}
              className={cn(
                "cursor-pointer",
                page === item &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={handleNavClick(nextGroupFirstPage, isLastGroup)}
            className={navClass(isLastGroup)}
            aria-disabled={isLastGroup}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLast
            onClick={handleNavClick(totalPages, isLastPage)}
            className={navClass(isLastPage)}
            aria-disabled={isLastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default HistoryPagination;
