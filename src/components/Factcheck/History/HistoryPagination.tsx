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
import { buildPaginationState } from "@/utils/pagination";

interface HistoryPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  pageGroupSize: number;
}

const HistoryPagination = ({ pagination, onPageChange, pageGroupSize }: HistoryPaginationProps) => {
  const { page, totalPages } = pagination;

  if (!totalPages || totalPages <= 1) return null;

  const {
    pageNumbers,
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

        {pageNumbers.map((item) => (
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
