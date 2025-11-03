"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, basePath = "/blog", searchParams = {} }: PaginationProps) {
  const createUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: page.toString() });
    return `${basePath}?${params.toString()}`;
  };

  const pages: (number | string)[] = [];
  
  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1, 2, 3);
    if (currentPage > 5) {
      pages.push("...");
    }
    
    const start = Math.max(4, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (i > 3 && i < totalPages - 2) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 4) {
      pages.push("...");
    }
    
    pages.push(totalPages - 2, totalPages - 1, totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={createUrl(currentPage - 1)}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={createUrl(pageNum)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createUrl(currentPage + 1)}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed">
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}





