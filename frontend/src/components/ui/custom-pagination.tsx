"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CustomPaginationProps) {
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 0) return pages;

    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
          pages.push(totalPages - 1);
        }
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push("...");
        for (let i = Math.max(totalPages - 4, 0); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-2 flex-wrap", className)}
      aria-label="Paginação"
    >
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground font-bold select-none"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Button
              key={`page-${pageNum}`}
              variant={currentPage === pageNum ? "ghost" : "destructive"}
              className={currentPage === pageNum ? "bg-amber-500" : ""}
              size="icon-sm"
              onClick={() => onPageChange(pageNum as number)}
              aria-label={`Ir para página ${(pageNum as number) + 1}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {(pageNum as number) + 1}
            </Button>
          )
        )}
      </div>

      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Próxima página"
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  );
}
