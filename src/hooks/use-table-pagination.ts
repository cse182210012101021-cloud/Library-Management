"use client";

import { TablePaginationProps } from "@/types/TablePaginationProps";

export function useTablePagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    const newPage = Math.max(1, currentPage - 5);
    onPageChange(newPage);
  };

  // Handle next click (go forward 5 pages or to last page)
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    const newPage = Math.min(totalPages, currentPage + 5);
    onPageChange(newPage);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return {
    pageNumbers,
    totalPages,
    handlePrevious,
    handleNext,
  };
}
